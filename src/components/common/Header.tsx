type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => (
  <header className="header">
    <h1>{title}</h1>
  </header>
);

export default Header; 