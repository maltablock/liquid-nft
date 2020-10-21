import { Box, Flex, Image, Link } from "bumbag";
import React from "react";
import { ReactComponent as Medium } from "../../assets/footer/logo-medium.svg";
import { ReactComponent as Telegram } from "../../assets/footer/logo-telegram.svg";
import { ReactComponent as Twitter } from "../../assets/footer/logo-twitter.svg";
import { ReactComponent as Mail } from "../../assets/footer/mail.svg";

interface SocialMedia {
  link: string;
  Sprite: any;
}
const socialMedia: SocialMedia[] = [
  // { link: "https://medium.com/@maltablock", Sprite: Medium },
  { link: "https://t.me/liquidnft", Sprite: Telegram },
  { link: "https://twitter.com/maltablock", Sprite: Twitter },
  { link: "mailto:michael@maltablock.org", Sprite: Mail },
];
const SocialMediaSprites: React.FC = () => {
  return (
    <Flex
      use="ul"
      width="350px"
      padding="0 0 20px 0"
      margin="0 auto"
      justifyContent="space-around"
      alignItems="center"
      listStyleType="none"
    >
      {socialMedia.map(({ link, Sprite }: SocialMedia) => (
        <Box use="li" width="30px" key={link}>
          <Link href={link} color="primary">
            <Sprite alt="Social sprite" />
          </Link>
        </Box>
      ))}
    </Flex>
  );
};

export default SocialMediaSprites;
