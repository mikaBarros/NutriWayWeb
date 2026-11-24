import type { ReactNode } from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
}

const SectionTitle = ({ eyebrow, title, action }: SectionTitleProps) => (
  <div className="section-title"><div><small>{eyebrow}</small><h2>{title}</h2></div>{action}</div>
);

export default SectionTitle;
