type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
  profile?: string;
};

const presentation: Presentation = {
  // mail: "maxencewolff.pro@gmail.com",
  mail: '',
  title: "Hey there, I’m Stefan 👋",
  // profile: "/profile.webp",
  description:
    "I'm a developer with 15+ years of experience building for the web. I'm currently focused on using React and TypeScript to make commerce better for everyone 💚",
  socials: [
    {
      label: "X",
      link: "https://x.com/stefanlegg",
    },
    {
      label: "Github",
      link: "https://github.com/stefanlegg",
    },
  ],
};

export default presentation;
