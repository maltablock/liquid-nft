import { Box, Flex, Image, Link } from "bumbag";
import React from "react";
import maltablockLogo from "../../assets/footer/logo-maltablock.svg";
import SocialMediaSprites from "./social-media-sprites";

const Footer: React.FC = () => {
  const copyRighttNotice = `© ${new Date().getFullYear()} Malta Block. All rights reserved.`;

  return (
    <Flex flexDirection="column" alignItems="center" marginTop="auto" marginX="auto" marginBottom="major-4" use="footer">
      <Image
        src={maltablockLogo}
        alt="logo"
        margin="0px auto 10px"
        height="52px"
      />
      <Box fontSize="20px" fontWeight="700" marginBottom="40px">
        <Link
          color="white"
          textDecoration="none"
          href="https://maltablock.org/"
          fontFamily="Montserrat"
        >
          MaltaBlock.org
        </Link>
      </Box>
      <SocialMediaSprites />
      <Flex fontSize="100" fontWeight="700" justifyContent="center" margin="0 0 8px 0">
        {[
          {
            link: `https://maltablock.org/files/terms.pdf`,
            text: "Terms of Reference",
          },
          {
            link: `https://maltablock.org/files/privacy-policy.pdf`,
            text: "Privacy Policy",
          },
        ].map(({ link, text }) => (
          <Link
            key={link}
            href={link}
            color="gray500"
            textDecoration="none"
            margin="0 10px"
            paddingX="10px"
          >
            {text}
          </Link>
        ))}
      </Flex>
      <Box use="p" fontSize="100" color="gray500">
        {" "}
        {copyRighttNotice}
      </Box>
    </Flex>
  );
};

export default Footer;
