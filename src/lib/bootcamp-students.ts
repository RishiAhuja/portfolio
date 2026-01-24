export interface BootcampStudent {
  name: string;
  linkedinProfile: string;
  linkedinPost?: string;
  initials: string;
  consent: boolean;
}

export function getBootcampStudents(): BootcampStudent[] {
  return [
    {
      name: "Anshika Verma",
      linkedinProfile: "https://www.linkedin.com/in/anshika-verma-a4353a392",
      linkedinPost: "https://www.linkedin.com/posts/anshika-verma-a4353a392_flutter-gdgc-appdevelopment-activity-7419788666975182848-nTRu",
      initials: "AV",
      consent: true
    },
    {
      name: "Nisha Priya",
      linkedinProfile: "https://www.linkedin.com/in/nisha-priya-66b274384",
      linkedinPost: "https://www.linkedin.com/posts/nisha-priya-66b274384_flutter-appdevelopment-studentdeveloper-activity-7419762888283824128-Gue2",
      initials: "NP",
      consent: true
    },
    {
      name: "Khushi",
      linkedinProfile: "https://www.linkedin.com/in/khushi-aggarwal-1a9425319",
      linkedinPost: "https://www.linkedin.com/posts/khushi-aggarwal-1a9425319_upskilling-mobileappdev-flutter-activity-7420145499674013696-lTMW",
      initials: "K",
      consent: true
    },
    {
      name: "Ashmit Thakur",
      linkedinProfile: "https://www.linkedin.com/in/ashmit-thakur-9481b3325",
      linkedinPost: "https://www.linkedin.com/posts/ashmit-thakur-9481b3325_utilized-my-winter-break-to-get-started-with-activity-7420148611021295616-8zg1",
      initials: "AT",
      consent: true
    },
    {
      name: "Sanket Puri Goswami",
      linkedinProfile: "https://www.linkedin.com/in/sanket-puri-goswami-b90b14371",
      linkedinPost: "https://www.linkedin.com/posts/sanket-puri-goswami-b90b14371_i-kicked-off-my-app-development-journey-this-activity-7419750647077470208-XjmY",
      initials: "SPG",
      consent: true
    },
    {
      name: "Bhumika Gupta",
      linkedinProfile: "https://www.linkedin.com/in/bhumika-gupta-301022322",
      linkedinPost: "https://www.linkedin.com/posts/bhumika-gupta-301022322_flutter-gdgcnitj-learningbybuilding-activity-7419788072432660481-fm8S?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE",
      initials: "BG",
      consent: true
    },
    {
      name: "Amrit Noor Singh",
      linkedinProfile: "https://www.linkedin.com/in/amrit-noor-singh-414a46326",
      linkedinPost: "https://www.linkedin.com/posts/amrit-noor-singh-414a46326_flutter-appdevelopment-learningjourney-activity-7420143807591022593-bsdV",
      initials: "ANS",
      consent: true
    },
    {
      name: "Ankit",
      linkedinProfile: "https://www.linkedin.com/in/ankit-sheoran-2487a8306",
      linkedinPost: "https://www.linkedin.com/posts/ankit-sheoran-2487a8306_appdevelopment-bootcamp-studentdeveloper-activity-7419708682847932416-_57c",
      initials: "A",
      consent: true
    },
    {
      name: "Disha Sharma",
      linkedinProfile: "https://www.linkedin.com/in/disha-sharma-3593a837b",
      linkedinPost: "https://www.linkedin.com/posts/disha-sharma-3593a837b_flutter-appdevelopment-gdgc-activity-7419725986126282752-5KBb",
      initials: "DS",
      consent: true
    },
    {
      name: "Kavish Garg",
      linkedinProfile: "https://www.linkedin.com/in/kavish0024",
      linkedinPost: "https://www.linkedin.com/posts/kavish0024_learning-flutter-wasnt-the-hardest-part-activity-7420356537237319680-EfAV",
      initials: "KG",
      consent: true
    },
    {
      name: "Sujal Kumar",
      linkedinProfile: "https://www.linkedin.com/in/sujal-gupta-4198b9368",
      linkedinPost: "https://www.linkedin.com/posts/sujal-gupta-4198b9368_flutter-appdevelopment-gdgc-activity-7419774753781104640-pNLn",
      initials: "SK",
      consent: true
    },
    {
      name: "Priyansh Kumar",
      linkedinProfile: "https://www.linkedin.com/in/priyansh-kumar-723421350",
      linkedinPost: "https://www.linkedin.com/posts/priyansh-kumar-723421350_participating-in-the-recent-campaign-by-gdgc-activity-7420547778298331136-aDCO",
      initials: "PK",
      consent: true
    }
  ];
}

export function getStudentCount(): number {
  return getBootcampStudents().filter(s => s.consent).length;
}
