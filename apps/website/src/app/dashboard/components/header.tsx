interface AristocratPageHeaderProps {
  title: string;
  description?: string;
}

export const AristocratPageHeader = (props: AristocratPageHeaderProps) => {
  const { title, description } = props;

  return (
    <header>
      <h1 className="font-medium font-serif text-2xl">{title}</h1>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </header>
  );
};
