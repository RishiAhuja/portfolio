import React from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import SmallContainer from './ui/SmallContainer';
import CalendarSchedule from './ui/CalendarSchedule';

const ContactSocial: React.FC = () => {
  const socialLinks = [
    {
      text: 'Twitter',
      clickLink: 'https://x.com/Rishi2220',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    },
    {
      text: 'Linkedin',
      clickLink: 'https://www.linkedin.com/in/rishi-ahuja-b1a224310/',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.542V1.729C24 .774 23.2 0 22.226 0z" /></svg>
    },
    {
      text: 'Hashnode',
      clickLink: 'https://rishi2220.hashnode.dev',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z" /></svg>
    },
    {
      text: 'Youtube',
      clickLink: 'https://www.youtube.com/@rishi2220',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    },
    {
      text: 'Email',
      clickLink: 'mailto:www.rishiahuja@gmail.com',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
  ];

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Ping Me" />
      <div className="h-4" />

      {/* Calendar Scheduling */}
      <div className="mb-6">
        <CalendarSchedule
          calcomUsername="rishi2220"
          eventType="30min"
          buttonText="Schedule a Meeting"
          className="w-full md:w-auto"
        />
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap gap-4">
        {socialLinks.map((link, index) => (
          <SmallContainer
            key={index}
            text={link.text}
            clickLink={link.clickLink}
            icon={link.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactSocial;