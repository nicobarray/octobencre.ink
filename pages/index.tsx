import React from 'react'
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

export default function Page() {
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

  const [src, setSrc] = React.useState(null)

  return (
    <>
      <Head>
        <title>Octobencre 2020</title>
      </Head>
      <Container>
        <Row>
          <Col>
            <Title>Octobencre 2020</Title>
          </Col>
        </Row>
        {days.map((day) => {
          const src = '/nby/octobencre2020-' + (day + 1) + '.jpg'
          return (
            <React.Fragment key={'day-' + day}>
              <Row>
                <Col xs={12} md={3}>
                  <Text>Jour {day + 1}</Text>
                  <Subtext>{themes[day]}</Subtext>
                </Col>
                <Col xs={12} md={3}>
                  <img
                    src={src}
                    alt="octobencre"
                    width="300"
                    onClick={() => setSrc(src)}
                  />
                </Col>
              </Row>
              <div style={{ height: 32 }} />
            </React.Fragment>
          )
        })}
      </Container>
      {src && <Modal src={src} onClick={() => setSrc(null)} />}
    </>
  )
}
