export interface KidProfile {
  user_id: number;
  user_nickname: string;
  created_on?: string;
}

export interface StoryRecord {
  user_story_id: number;
  story_id: number;
  story_title: string;
}

export interface ParentMainPageProps {
  onLogout?: () => void;
  onTokenExpired?: () => void;
  onStorySelect?: (storyId: string) => void;
  onCreateStoryClick?: () => void;
}