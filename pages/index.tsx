import React from 'react'
import Head from 'next/head'
import Image from 'next/image'

import styled from 'styled-components'
import { Col, Container, Row } from 'react-bootstrap'

const Text = styled.div`
  background: black;
  color: white;

  padding: 4px 8px;
`

const Subtext = styled.div`
  font-size: 0.8em;

  padding: 4px 8px;
`

const Title = styled.h1`
  font-size: 2em;
  padding: 4px 8px;
`

const Author = styled.div`
  font-size: 1.2em;
  font-style: italic;
  color: grey;
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-image: url(${(props) => props.src});
  background-position: center;
  background-size: contain;
`

const Drawing = styled(Image).attrs({ unsized: true })`
  width: 100%;
  margin-bottom: 32px;
`

export const DailyImage = ({ src, setPreviewSrc }) => {
  return (
    <Col xs={12} md={3}>
      <Drawing src={src} onClick={() => setPreviewSrc(src)} />
    </Col>
  )
}

function getLastDay() {
  return new Date().getMonth() === 9 ? new Date().getDate() : 31
}

function getPublicEndpoint() {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production'
      ? 'https://octobencre.ink'
      : 'http://localhost:3000'
  }

  return (
    window.location.protocol +
    '//' +
    window.location.hostname +
    ':' +
    window.location.port
  )
}

async function fetchData() {
  const lastDay = getLastDay()

  try {
    const publicEndpoint = getPublicEndpoint()
    const data = await fetch(publicEndpoint + '/octobencre2020.json')
    const manifest = await data.json()

    // * remove future days
    manifest.days = manifest.days
      .filter((dayData) => dayData.day <= lastDay)
      .map((dayData) => {
        if (dayData.day === lastDay) {
          const getSrc = (src) => {
            if (src === '/shame.png') {
              return '/waiting.gif'
            }
            return src
          }

          const drawings = Object.keys(dayData.drawings).reduce(
            (srcs, trigram) => ({
              ...srcs,
              [trigram]: getSrc(dayData.drawings[trigram]),
            }),
            {}
          )

          return {
            ...dayData,
            drawings,
          }
        }
        return dayData
      })
      .reverse()

    return manifest
  } catch (err) {
    console.log(err)
    return {}
  }
}

export default function Page({ serverData }) {
  const [src, setSrc] = React.useState(null)
  const [data, setData] = React.useState(() => serverData)

  React.useEffect(() => {
    async function fetchInitialStateClientSide() {
      const initialData = await fetchData()
      setData(initialData)
    }

    if (!data) {
      console.log('[fetchData] Fetching src client-side...')
      fetchInitialStateClientSide()
    } else {
      console.log('[fetchData] Image src are hydrated server-side')
    }
  }, [])

  return (
    <>
      <Head>
        <title>Octobencre 2020</title>
      </Head>

      <Container fluid>
        <Row>
          <Col>
            <Title>Octobencre 2020</Title>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={2}>
            <Text>Fait par</Text>
          </Col>
          <Col xs={12} md={3}>
            <Author>
              <a href="https://www.twitter.com/nicobarray">@nicobarray</a>
            </Author>
          </Col>
          <Col xs={12} md={3}>
            <Author>
              <a href="https://twitter.com/LouisAumaitre">@LouisAumaitre</a>
            </Author>
          </Col>
          <Col xs={12} md={3}>
            <Author>
              <a href="https://twitter.com/IDelaunet">@IDelaunet</a>
            </Author>
          </Col>
          <Col xs={12} md={3}></Col>
        </Row>
        <div style={{ height: 32 }} />
        {data?.days?.map(({ theme, day, drawings }) => {
          return (
            <Row key={day}>
              <Col xs={12} md={2}>
                <Text>Jour {day}</Text>
                <Subtext>{theme}</Subtext>
              </Col>
              {data.who.map((trigram) => {
                return (
                  <DailyImage
                    key={trigram}
                    src={drawings[trigram]}
                    setPreviewSrc={setSrc}
                  />
                )
              })}
            </Row>
          )
        })}
      </Container>
      {src && <Modal src={src} onClick={() => setSrc(null)} />}
    </>
  )
}

export async function getServerSideProps({ query }) {
  if (query.ssr === 'false') {
    return { props: {} }
  }

  const serverData = await fetchData()
  return {
    props: {
      serverData,
    },
  }
}
