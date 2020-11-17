import React from 'react'
import NextLink from 'next/link'
import { Box, Button, Flex, Link } from '@chakra-ui/core'
import { useMeQuery } from '../generated/graphql'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()

  let body
  const isUserLoggedIn = data?.me

  if (fetching) {
    body = null
  } else if (!isUserLoggedIn) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data!.me?.username}</Box>
        <Button color="var(--dark)" variant="link">
          logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box color="white" ml="auto">
        {body}
      </Box>
    </Flex>
  )
}
