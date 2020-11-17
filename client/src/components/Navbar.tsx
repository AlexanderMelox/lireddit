import React from 'react'
import NextLink from 'next/link'
import { Box, Button, Flex, Link } from '@chakra-ui/core'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: isLoggingOut }, logout] = useLogoutMutation()
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
        <Button
          onClick={() => logout()}
          color="var(--dark)"
          variant="link"
          isLoading={isLoggingOut}
        >
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
