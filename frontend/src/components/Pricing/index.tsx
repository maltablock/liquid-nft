import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Link as BBLink,
} from "bumbag";
import React from "react";
import { Link } from "react-router-dom";

const PricingOverview: React.FC<{}> = props => {
  return (
    <Container
      use="main"
      breakpoint="desktop"
      alignX="center"
      marginTop="major-12"
      marginBottom="major-4"
      width="100%"
      paddingX="major-1"
    >
      <Heading
        use="h1"
        fontSize="700"
        color="tertiary"
        letterSpacing="-2px"
        fontWeight="700"
        textTransform="uppercase"
        marginBottom="major-10"
      >
        Liquid NFT Pricing
      </Heading>
      <Flex
        width="100%"
        flexDirection={{ default: `row`, "max-mobile": `column` }}
        justifyContent={{ default: `space-evenly`, "max-mobile": `center` }}
        alignItems={{ default: `stretch`, "max-mobile": `center` }}
      >
        <Flex
          flex="1"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="secondary"
          borderRadius="3"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="major-6"
          paddingBottom="major-5"
          paddingX="major-6"
          maxWidth="400px"
          backgroundColor="background2"
          marginBottom={{ default: `0`, 'max-mobile': `major-3`}}
        >
          <Heading
            use="h3"
            fontSize="500"
            color="tertiary"
            fontWeight="700"
            textTransform="uppercase"
          >
            Free
          </Heading>
          <Text.Block
            use="p"
            marginTop="major-6"
            marginBottom="major-6"
            fontSize="300"
            fontWeight="600"
            textAlign="center"
          >
            Storage up to 1GB is free
          </Text.Block>
          <Link
            to="/"
            component={props => <BBLink variant="primary" {...props} />}
          >
            Start
          </Link>
        </Flex>
        <Flex
          flex="1"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="secondary"
          borderRadius="3"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="major-6"
          paddingBottom="major-5"
          paddingX="major-6"
          maxWidth="400px"
          backgroundColor="background2"
        >
          <Heading
            use="h3"
            fontSize="500"
            color="tertiary"
            fontWeight="700"
            textTransform="uppercase"
          >
            Business
          </Heading>
          <Text.Block
            use="p"
            marginTop="major-6"
            marginBottom="major-6"
            textAlign="center"
          >
            We can provide unlimited storage and IPFS pinning services by
            creating customized solutions for your project. Please contact us
            for more details.
          </Text.Block>
          <BBLink variant="primary" use="a" href="https://t.me/liquidnft">
            Contact Us
          </BBLink>
        </Flex>
      </Flex>
      <Heading
        use="h2"
        fontSize="400"
        color="secondary"
        fontWeight="700"
        marginTop="major-10"
        marginBottom="major-5"
      >
        Multiple replications of data:
      </Heading>
      <Text.Block
        use="p"
        fontSize="200"
        fontWeight="400"
        marginBottom="major-6"
        textAlign="center"
        maxWidth="500px"
      >
        If your project needs fast response times for discovering your content
        on IPFS, then having multiple replications of your data helps. If your
        content is present on multiple nodes, it can be discovered faster.
        <br />
        <br />
        We can help you with this by leveraging other DSPs on WAX blockchain.
      </Text.Block>
      <BBLink variant="primary" use="a" href="https://t.me/liquidnft">
        Contact Us
      </BBLink>
    </Container>
  );
};

export default PricingOverview;
