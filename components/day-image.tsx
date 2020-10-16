import React from 'react'
import styled from 'styled-components'
import { Col } from 'react-bootstrap'

const Shame = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Drawing = styled.img`
  width: 100%;
  margin-bottom: 32px;
`

export const DayImage = ({ day, trigram, setSrc }) => {
  const src = '/' + trigram + '/octobencre2020-' + (day + 1) + '.jpg'

  return (
    <Col xs={12} md={3}>
      <Drawing
        srcset={'/' + 'nby' + '/octobencre2020-' + 1 + '.jpg'}
        src={src}
        rounded
        onClick={() => setSrc(src)}
      />
    </Col>
  )
}

export default DayImage
