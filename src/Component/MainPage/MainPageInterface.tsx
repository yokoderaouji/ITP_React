


export interface Story {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  locked: boolean;
  requiredLevel?: number;
  tags: string[];
}

export interface ApiStory {
  story_id: number;
  story_title: string;
  story_description: string;
  story_content?: string;
  story_start?: string;
  story_setting_1?: string;
  story_setting_2?: string;
  story_setting_3?: string;
  story_setting_4?: string;
  story_setting_5?: string;
  story_tag_1?: string;
  story_tag_2?: string;
  story_tag_3?: string;
  story_status?: string;
  [key: string]: any;
}