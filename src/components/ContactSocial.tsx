import React from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import SmallContainer from '@/components/ui/SmallContainer';
import CalendarSchedule from '@/components/ui/CalendarSchedule';

const ContactSocial: React.FC = () => {
  const socialLinks = [
    {
      text: 'Twitter',
      clickLink: 'https://x.com/Rishi2220',
    },
    {
      text: 'Linkedin',
      clickLink: 'https://www.linkedin.com/in/rishi-ahuja-b1a224310/',
    },
    {
      text: 'Hashnode',
      clickLink: 'https://rishi2220.hashnode.dev',
    },
    {
      text: 'Youtube',
      clickLink: 'https://www.youtube.com/@rishi2220',
    },
    {
      text: 'Email',
      clickLink: 'mailto:www.rishiahuja@gmail.com',
    },
  ];

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Contact & Social" />
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
          />
        ))}
      </div>
    </div>
  );
};

export default ContactSocial;