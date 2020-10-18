import React from 'react'
import ReactDOM from 'react-dom'
import Head from 'next/head'
import styled from 'styled-components'
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import dynamic from 'next/dynamic'

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
const days = range(17)
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

const DayImage = dynamic(() => import('../components/day-image'), {
  loading: () => <DayImagePlaceholder src={'/lae/octobencre2020-15.jpg'} />,
})

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
        <DayImage day={day} trigram="idt" setSrc={setSrc} />
      </Row>
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

        {days.map((day) => {
          return <Day key={day} day={day} setSrc={setSrc} />
        })}
      </Container>
      {src && <Modal src={src} onClick={() => setSrc(null)} />}
    </>
  )
}
