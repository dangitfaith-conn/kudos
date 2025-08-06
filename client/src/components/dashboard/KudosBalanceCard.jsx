import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const KudosBalanceCard = ({ profile, loading, error }) => {
  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="lg">
          Your Award Balance
        </Heading>
      </CardHeader>
      <CardBody>
        <Text fontSize="4xl" fontWeight="bold" color="teal.500">
          {profile?.award_balance || 0} 🏆
        </Text>
      </CardBody>
    </Card>
  );
};

export default KudosBalanceCard;
