interface Props {
  vibe: string;
  active?: boolean;
  onClick?: () => void;
}

export default function VibeTag({ vibe, active = false, onClick }: Props) {
  return (
    <span
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm cursor-pointer ${active ? 'bg-primary text-white' : 'bg-surface text-black border'}`}
    >
      {vibe}
    </span>
  );
}
