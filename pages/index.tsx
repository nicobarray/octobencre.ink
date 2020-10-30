import React from 'react'
import Head from 'next/head'
import Image from 'next/image'

import styled from 'styled-components'
import { Col, Container, Row } from 'react-bootstrap'

import data from '../generated/drawings.json'

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

export const DailyImage = ({ alt, drawing, setPreviewSrc }) => {
  const { src, width, height } = drawing

  return (
    <Col xs={12} md={3}>
      <Image
        src={src}
        onClick={() => {
          if (src.endsWith('waiting.gif') || src.endsWith('shame.png')) {
            return
          }
          setPreviewSrc(src)
        }}
        width={width}
        height={height}
        alt={alt}
      />
      <div style={{ height: 32 }} />
    </Col>
  )
}

function getLastDay() {
  const now = new Date()
  if (now.getMonth() === 9) {
    return now.getDate()
  }

  return 31
}

export default function Page({ data }) {
  const [src, setSrc] = React.useState(null)
  const { days, who } = data

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
        {days.map(({ theme, day, drawings }) => {
          return (
            <Row key={day}>
              <Col xs={12} md={2}>
                <Text>Jour {day}</Text>
                <Subtext>{theme}</Subtext>
              </Col>
              {who.map((trigram) => {
                return (
                  <DailyImage
                    key={day + '-' + trigram}
                    alt={
                      'Dessin de ' + trigram + ' du ' + day + ' octobre 2020'
                    }
                    drawing={drawings[trigram]}
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

export async function getStaticProps() {
  const lastDay = getLastDay()

  // Replace missing drawing on the last day with a waiting gif.
  const updatedData = {
    ...data,
    days: data.days
      .filter(({ day }) => day <= lastDay)
      .map((dayData) => {
        if (dayData.day === lastDay) {
          for (let trigram of data.who) {
            if (dayData.drawings[trigram].src.endsWith('shame.png')) {
              dayData.drawings[trigram] = {
                src: '/waiting.gif',
                ...data.waiting,
              }
            }
          }
        }

        return dayData
      }),
  }

  return {
    props: {
      data: updatedData,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  }
}
