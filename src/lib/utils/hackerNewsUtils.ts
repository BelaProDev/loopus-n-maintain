const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export const fetchTopStories = async (): Promise<number[]> => {
  const response = await fetch(`${HN_API_BASE}/topstories.json`);
  return response.json();
};

export const fetchStoryById = async (id: number): Promise<HNStory> => {
  const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
  return response.json();
};

export const fetchTopHNStories = async (limit: number = 10): Promise<HNStory[]> => {
  const topStoryIds = await fetchTopStories();
  const stories = await Promise.all(
    topStoryIds.slice(0, limit).map(id => fetchStoryById(id))
  );
  return stories;
};