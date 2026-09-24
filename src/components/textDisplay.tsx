import { Textarea } from "./ui/textarea";

export default function TextDisplay({
  edit,
  id,
}: {
  edit: boolean;
  id: string;
}) {
  const p = localStorage.getItem(id);
  return (
    <div>
      {edit ? (
        <Textarea
          onChange={(e) => {
            localStorage.setItem(id, e.currentTarget.value);
          }}
          placeholder={p!}
          className="rounded-md w-full h-full min-h-20 text-background dark:text-primary dark:border-primary"
        />
      ) : (
        <div className="w-full h-full text-lg text-pretty backdrop-blur-md text-background border min-h-20  dark:text-primary dark:border-primary rounded-md grid place-items-center">
          {p}
        </div>
      )}
    </div>
  );
}
