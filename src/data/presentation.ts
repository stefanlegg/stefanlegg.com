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
    "I’ve been building for the web for over 15 years—everything from scrappy experiments to tools used by millions around the world. These days, I’m focused on React, TypeScript, and making commerce better for everyone 💚",
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
