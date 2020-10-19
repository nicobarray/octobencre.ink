import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import { Col, Container, Row, Spinner } from 'react-bootstrap'

const range = (n: number): number[] => {
  return [...new Array(n).keys()].reverse()
}
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

const themes = [
  'Brume',
  'Antique',
  'Frange',
  'Perdu',
  'Clef',
  'Argent',
  'Confus',
  'Familier',
  'Tranche',
  'Dégoulinant',
  'Corde',
  'Fané',
  'Cuir',
  'Pente',
  'Ovale',
  'Temple',
  'Antenne',
  'Plante',
  'Pale',
  'Minéral',
  'Auteur',
  'Académique',
  'Superstitieux',
  'Bulle',
  'Code',
  'Chaudron',
  'Traîne',
  'Reste',
  'Mains',
  'Encore',
  'Pomme de pain',
]

const DayImagePlaceholder = styled.img`
  width: 100%;
  margin-bottom: 32px;
  background: black;
`

const Drawing = styled.img`
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

const Day = ({ artworks, day, setPreviewSrc }) => {
  return (
    <>
      <Row>
        <Col xs={12} md={2}>
          <Text>Jour {day}</Text>
          <Subtext>{themes[day - 1]}</Subtext>
        </Col>
        {artworks.map((artwork) => {
          return (
            <DailyImage
              key={artwork.trigram}
              src={artwork.src}
              setPreviewSrc={setPreviewSrc}
            />
          )
        })}
      </Row>
    </>
  )
}

function getDays() {
  const latestOctoberDay =
    new Date().getMonth() === 9 ? new Date().getDate() : 31
  return range(latestOctoberDay)
}

async function fetchData() {
  const days = getDays()
  const trigrams = ['nby', 'lae', 'idt']
  const payloads = []
  for (let day of days) {
    const artworks = []
    for (let trigram of trigrams) {
      const response = await fetch(
        'http://localhost:3000/api/artists/' +
          trigram +
          '/day-of-the-month/' +
          day
      )
      const src = await response.text()
      artworks.push({ src, trigram, day })
    }
    payloads.push(artworks)
  }

  return days
    .map((day) => payloads[day])
    .sort((dayA, dayB) => dayB[0].day - dayA[0].day)
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
        {data?.map((artworks, dayMinusOne) => {
          const day = artworks[0].day ?? data.length - 1 - dayMinusOne
          if (day === 0) {
            return null
          }

          return (
            <Day
              key={dayMinusOne}
              day={day}
              artworks={artworks}
              setPreviewSrc={setSrc}
            />
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
