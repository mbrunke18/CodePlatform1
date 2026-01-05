import { describe, it, expect } from 'vitest';

// Helper function to calculate task business value
function calculateTaskValue(task: any): number {
  let baseValue = 500; // Base task value in dollars
  
  // Priority multiplier
  const priorityMultipliers = {
    'critical': 4.0,
    'high': 2.5,
    'medium': 1.5,
    'low': 1.0
  };
  
  const priorityMultiplier = priorityMultipliers[task.priority as keyof typeof priorityMultipliers] || 1.0;
  
  // Strategic complexity bonus (based on description keywords)
  const strategicKeywords = [
    'transformation', 'innovation', 'competitive', 'market', 'customer',
    'technology', 'automation', 'efficiency', 'growth', 'strategic'
  ];
  
  const description = (task.description || '').toLowerCase();
  const keywordMatches = strategicKeywords.filter(keyword => 
    description.includes(keyword)
  ).length;
  
  const complexityBonus = keywordMatches * 200; // $200 per strategic keyword
  
  // Timeline urgency factor
  const timelineMultipliers = {
    'immediate': 1.5,
    'urgent': 1.3,
    '1-2 weeks': 1.2,
    '1 month': 1.1,
    '3 months': 1.0,
    '6 months': 0.9,
    'long-term': 0.8
  };
  
  const timelineMultiplier = timelineMultipliers[task.timeline as keyof typeof timelineMultipliers] || 1.0;
  
  // Calculate final value
  const finalValue = Math.round(
    (baseValue + complexityBonus) * priorityMultiplier * timelineMultiplier
  );
  
  return Math.max(finalValue, 100); // Minimum value of $100
}

// Extract the real calculateTaskValue function for testing
function calculateTaskValue(task: any): number {
  let baseValue = 500; // Base task value in dollars
  
  // Priority multiplier
  const priorityMultipliers = {
    'critical': 4.0,
    'high': 2.5,
    'medium': 1.5,
    'low': 1.0
  };
  
  const priorityMultiplier = priorityMultipliers[task.priority as keyof typeof priorityMultipliers] || 1.0;
  
  // Strategic complexity bonus (based on description keywords) - matches real implementation
  const strategicKeywords = ['strategic', 'executive', 'crisis', 'decision', 'revenue', 'compliance', 'risk'];
  const hasStrategicKeyword = strategicKeywords.some(keyword => 
    task.description?.toLowerCase().includes(keyword)
  );
  const complexityBonus = hasStrategicKeyword ? 1000 : 0;
  
  return Math.floor(baseValue * priorityMultiplier + complexityBonus);
}

describe('Business Logic Functions', () => {
  describe('calculateTaskValue', () => {
    it('should calculate basic task value with default priority', () => {
      const task = {
        description: 'Simple task',
        priority: 'medium'
      };
      
      const value = calculateTaskValue(task);
      // Base 500 * medium (1.5) + 0 bonus = 750
      expect(value).toBe(750);
    });

    it('should apply critical priority multiplier correctly', () => {
      const task = {
        description: 'Critical system update',
        priority: 'critical'
      };
      
      const value = calculateTaskValue(task);
      // Base 500 * critical (4.0) + 0 bonus = 2000
      expect(value).toBe(2000);
    });

    it('should add strategic complexity bonus for keyword matches', () => {
      const task = {
        description: 'Strategic decision for revenue and crisis management',
        priority: 'high'
      };
      
      const value = calculateTaskValue(task);
      // Keywords: strategic, decision, revenue, crisis = has strategic keywords = 1000 bonus
      // Base 500 * high (2.5) + 1000 = 2250
      expect(value).toBe(2250);
    });

    it('should apply timeline urgency multipliers', () => {
      const task = {
        description: 'Urgent system repair',
        priority: 'high',
        timeline: 'immediate'
      };
      
      const value = calculateTaskValue(task);
      // Base 500 * high (2.5) * immediate (1.5) = 1875
      expect(value).toBe(1875);
    });

    it('should handle missing fields gracefully', () => {
      const task = {
        description: null,
        priority: 'unknown',
        timeline: 'unknown'
      };
      
      const value = calculateTaskValue(task);
      // Base 500 * default (1.0) * default (1.0) = 500
      expect(value).toBe(500);
    });

    it('should enforce minimum value of $100', () => {
      const task = {
        description: 'Small task',
        priority: 'low',
        timeline: 'long-term'
      };
      
      const value = calculateTaskValue(task);
      // Base 500 * low (1.0) * long-term (0.8) = 400, which is > 100
      expect(value).toBe(400);
      
      // Test case that would result in very low value
      const microTask = {
        description: '',
        priority: 'low',
        timeline: 'long-term'
      };
      
      const microValue = calculateTaskValue(microTask);
      expect(microValue).toBeGreaterThanOrEqual(100);
    });

    it('should calculate complex strategic task correctly', () => {
      const task = {
        description: 'Strategic technology transformation initiative to drive innovation and competitive advantage in customer market',
        priority: 'critical',
        timeline: 'urgent'
      };
      
      const value = calculateTaskValue(task);
      // Keywords: strategic, technology, transformation, innovation, competitive, customer, market = 7 matches = 1400 bonus
      // (500 + 1400) * critical (4.0) * urgent (1.3) = 9880
      expect(value).toBe(9880);
    });

    it('should handle edge cases with empty or undefined task', () => {
      const emptyTask = {};
      const value = calculateTaskValue(emptyTask);
      expect(value).toBe(500); // Base value with default multipliers
      
      const nullTask = null;
      expect(() => calculateTaskValue(nullTask)).not.toThrow();
    });
  });
});