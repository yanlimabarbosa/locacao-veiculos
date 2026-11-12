type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-muted">{description}</p>
    </header>
  );
}
