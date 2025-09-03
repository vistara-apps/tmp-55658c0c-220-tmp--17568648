import VibeTag from './VibeTag';

interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  venue_name: string;
  social_media_url: string;
  trend_score: number;
  vibe_tags: string[];
  image_url: string;
  video_url: string;
}

interface Props {
  recommendation: Recommendation;
  onSave: (id: string) => void;
}

export default function RecommendationCard({ recommendation, onSave }: Props) {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-card">
      <img src={recommendation.image_url} alt={recommendation.title} className="w-full h-48 object-cover rounded-md" />
      <h3 className="text-heading mt-2">{recommendation.title}</h3>
      <p className="text-body">{recommendation.description}</p>
      <p className="text-sm">Venue: {recommendation.venue_name}</p>
      <p className="text-sm">Trend Score: {recommendation.trend_score}</p>
      <div className="flex gap-2 mt-2">
        {recommendation.vibe_tags.map(tag => (
          <VibeTag key={tag} vibe={tag} />
        ))}
      </div>
      <a href={recommendation.social_media_url} target="_blank" className="text-primary block mt-2">View on Social</a>
      <video src={recommendation.video_url} controls className="w-full mt-2" />
      <button onClick={() => onSave(recommendation.recommendationId)} className="mt-2 bg-accent text-white px-4 py-2 rounded-md">
        Save
      </button>
    </div>
  );
}
