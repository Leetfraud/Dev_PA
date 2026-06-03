import OpenAI from 'openai';
import { config } from '../config/env.js';

class AIService {
  constructor() {
    this.enabled = !!config.openaiApiKey;
    if (this.enabled) {
      this.client = new OpenAI({
        apiKey: config.openaiApiKey,
      });
    }
  }

  async generateSuggestions(profile) {
    if (!this.enabled) {
      return this.getFallbackSuggestions(profile);
    }

    try {
      const prompt = this.buildPrompt(profile);
      
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert GitHub portfolio analyst. Generate 3-5 actionable improvement suggestions for developers based on their profile data. Return ONLY valid JSON array with no markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0].message.content.trim();
      const suggestions = JSON.parse(content);

      return this.validateSuggestions(suggestions);
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return this.getFallbackSuggestions(profile);
    }
  }

  buildPrompt(profile) {
    const { githubData, repositories, analytics } = profile;

    const context = {
      username: githubData.login,
      repos: githubData.public_repos,
      followers: githubData.followers,
      total_stars: analytics.total_stars,
      total_forks: analytics.total_forks,
      portfolio_score: analytics.portfolio_score,
      activity_score: analytics.activity_score,
      documentation_score: analytics.documentation_score,
      popularity_score: analytics.popularity_score,
      stack_maturity_score: analytics.stack_maturity_score,
      primary_stack: analytics.primary_stack,
      languages: Object.keys(analytics.languages || {}).slice(0, 5),
      repos_with_readme: repositories.filter(r => r.has_readme).length,
      repos_with_license: repositories.filter(r => r.has_license).length,
      repos_with_description: repositories.filter(r => r.description).length,
    };

    return `Analyze this GitHub profile and generate 3-5 specific, actionable improvement suggestions:

Profile Summary:
- Username: ${context.username}
- Repositories: ${context.repos}
- Followers: ${context.followers}
- Total Stars: ${context.total_stars}
- Portfolio Score: ${context.portfolio_score}/100
- Activity Score: ${context.activity_score}/100
- Documentation Score: ${context.documentation_score}/100
- Popularity Score: ${context.popularity_score}/100
- Stack Maturity: ${context.stack_maturity_score}/100
- Primary Stack: ${context.primary_stack}
- Languages: ${context.languages.join(', ')}
- Repos with README: ${context.repos_with_readme}/${context.repos}
- Repos with License: ${context.repos_with_license}/${context.repos}
- Repos with Description: ${context.repos_with_description}/${context.repos}

Return a JSON array of 3-5 suggestions. Each suggestion must have:
{
  "category": "Documentation|Code Quality|Engagement|Visibility|Tech Stack",
  "priority": "high|medium|low",
  "title": "Brief actionable title",
  "defect": "What's missing or could be improved",
  "solution": "Specific actionable steps to fix it",
  "impact": "Expected improvement (e.g., '+10 score points')"
}

Return ONLY the JSON array, no markdown formatting.`;
  }

  validateSuggestions(suggestions) {
    if (!Array.isArray(suggestions)) {
      throw new Error('Invalid suggestions format');
    }

    return suggestions.slice(0, 5).map(s => ({
      category: s.category || 'General',
      priority: ['high', 'medium', 'low'].includes(s.priority) ? s.priority : 'medium',
      title: s.title || 'Improvement Suggestion',
      defect: s.defect || s.description || '',
      solution: s.solution || s.actionable_solution || '',
      impact: s.impact || '+5 score points',
    }));
  }

  getFallbackSuggestions(profile) {
    const suggestions = [];
    const { repositories, analytics, githubData } = profile;

    const reposWithoutReadme = repositories.filter(r => !r.has_readme).length;
    if (reposWithoutReadme > 0) {
      suggestions.push({
        category: 'Documentation',
        priority: 'high',
        title: `Add README files to ${reposWithoutReadme} repositories`,
        defect: `${reposWithoutReadme} of your ${repositories.length} repositories lack README.md files`,
        solution: 'Create comprehensive README files with project description, installation instructions, usage examples, and screenshots',
        impact: '+12 score points',
      });
    }

    if (analytics.documentation_score < 70) {
      suggestions.push({
        category: 'Code Quality',
        priority: 'medium',
        title: 'Improve inline code documentation',
        defect: 'Your repositories lack comprehensive inline comments and function-level documentation',
        solution: 'Add docstrings to all public functions, document complex algorithms, and use consistent comment style',
        impact: '+8 score points',
      });
    }

    const languageCount = Object.keys(analytics.languages || {}).length;
    if (languageCount < 3) {
      suggestions.push({
        category: 'Tech Stack',
        priority: 'medium',
        title: 'Diversify your language portfolio',
        defect: `You primarily use ${languageCount} language(s). Expanding your tech stack increases your appeal`,
        solution: 'Build projects in modern languages like TypeScript, Go, or Rust. Contribute to open-source in target languages',
        impact: '+10 score points',
      });
    }

    if (githubData.followers < 100) {
      suggestions.push({
        category: 'Engagement',
        priority: 'low',
        title: 'Increase community engagement',
        defect: 'Low follower count suggests limited community presence',
        solution: 'Contribute to popular open-source projects, write technical blog posts, and engage in GitHub discussions',
        impact: '+6 score points',
      });
    }

    if (!githubData.bio || githubData.bio.length < 20) {
      suggestions.push({
        category: 'Visibility',
        priority: 'low',
        title: 'Create a compelling profile bio',
        defect: 'Your profile lacks a detailed bio that showcases your expertise',
        solution: 'Write a clear bio highlighting your skills, interests, and what you\'re working on',
        impact: '+4 score points',
      });
    }

    return suggestions.slice(0, 5);
  }
}

export default new AIService();
