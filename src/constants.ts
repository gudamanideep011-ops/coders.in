import { User, Video } from './types';

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Mastering React in 2024',
    thumbnail: 'https://picsum.photos/seed/react/800/450',
    author_id: 'user1',
    language: 'JavaScript',
    views: 1200,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    title: 'Python for Data Science',
    thumbnail: 'https://picsum.photos/seed/python/800/450',
    author_id: 'user2',
    language: 'Python',
    views: 850,
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    title: 'Advanced C# Patterns',
    thumbnail: 'https://picsum.photos/seed/csharp/800/450',
    author_id: 'user3',
    language: 'C#',
    views: 2300,
    timestamp: '1 day ago'
  },
  {
    id: '4',
    title: 'Rust vs Go: The Ultimate Showdown',
    thumbnail: 'https://picsum.photos/seed/rust/800/450',
    author_id: 'user4',
    language: 'Rust',
    views: 5000,
    timestamp: '3 days ago'
  }
];

export const LANGUAGES = [
  'JavaScript', 'Python', 'C#', 'Java', 'C++', 'Rust', 'Go', 'Swift', 'Kotlin', 'TypeScript'
];

export const INTERNSHIP_NOTES = [
  {
    week: 1,
    title: 'Fundamentals & Logic',
    content: 'Focus on variables, loops, and basic data structures. Understanding how computers think.'
  },
  {
    week: 2,
    title: 'Advanced Concepts',
    content: 'Object-oriented programming, functional paradigms, and memory management.'
  },
  {
    week: 3,
    title: 'Real-world Application',
    content: 'Building scalable systems, APIs, and database interactions.'
  }
];
