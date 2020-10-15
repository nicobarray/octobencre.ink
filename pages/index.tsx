import React from 'react'
import ReactDOM from 'react-dom'
import Head from 'next/head'
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

const range = (n: number): number[] => {
  return [...new Array(n).keys()].reverse()
}
const days = range(15)
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

const Shame = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Image = styled.img`
  width: 100%;
`

const DayImage = ({ day, trigram, setSrc }) => {
  const src = '/' + trigram + '/octobencre2020-' + (day + 1) + '.jpg'
  const [error, setError] = React.useState(null)

  // * Trigger client-side rendering because the img.onError callback
  // * is not call server-side.
  React.useEffect(() => {
    if (day <= new Date().getDate() - 3) {
      return
    }

    async function showShame() {
      const res = await fetch(src)
      console.log(res.status)
      if (res.status === 404) {
        throw new Error('shame')
      }
    }

    showShame().catch(() => setError(true))
  }, [src])

  return (
    <Col xs={12} md={3}>
      {error ? (
        <Shame>🔔</Shame>
      ) : (
        <Image
          src={src}
          alt="octobencre"
          onClick={() => setSrc(src)}
          onError={() => {
            console.log('Test')
            setError(true)
          }}
        />
      )}
    </Col>
  )
}
const Day = ({ day, setSrc }) => {
  return (
    <>
      <Row>
        <Col xs={12} md={2}>
          <Text>Jour {day + 1}</Text>
          <Subtext>{themes[day]}</Subtext>
        </Col>
        <DayImage day={day} trigram="nby" setSrc={setSrc} />
        <DayImage day={day} trigram="lae" setSrc={setSrc} />
      </Row>
      <div style={{ height: 32 }} />
    </>
  )
}

export default function Page() {
  const [src, setSrc] = React.useState(null)

  return (
    <>
      <Head>
        <title>Octobencre 2020</title>
      </Head>

      <Row>
        <Col>
          <Title>Octobencre 2020</Title>
        </Col>
      </Row>

      <Container fluid>
        <Row>
          <Col xs={12} md={2}>
            <Text>Fait par</Text>
          </Col>
          <Col xs={12} md={3}>
            <Author>
              <a href="https://www.twitter.com/nicobarray">nicobarray</a>
            </Author>
          </Col>
          <Col xs={12} md={3}>
            <Author>
              <a href="https://twitter.com/LouisAumaitre">Louis Aumaitre</a>
            </Author>
          </Col>
          <Col xs={12} md={3}></Col>
        </Row>
        <div style={{ height: 32 }} />

        {days.map((day) => {
          return <Day key={day} day={day} setSrc={setSrc} />
        })}
      </Container>
      {src && <Modal src={src} onClick={() => setSrc(null)} />}
    </>
  )
}
