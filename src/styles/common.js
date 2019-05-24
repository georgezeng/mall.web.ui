const header = {
    margin: 0,
    padding: '0 10px',
    backgroundColor: '#DA4935',
    position: 'fixed',
    'z-index': 100,
    width: '100%',
    color: '#fff',
    fontSize: '16pt',
    textAlign: 'center'
}

const tideHeader = {
    ...header,
    height: '40px',
    fontSize: '11pt',
    lineHeight: '40px'
}

const backArrow = {
    position: 'absolute',
    top: '18px',
    left: '10px'
}

const goArrow = {
    position: 'absolute',
    top: '18px',
    right: '10px'
}

const layout = {
    margin: '0 auto',
    padding: 0
}

const content = {
    padding: '0',
    position: 'relative',
    backgroundColor: '#fff'
}

const footer = {
    width: '100%',
    backgroundColor: '#fff',
    position: 'fixed',
    zIndex: 100,
    width: '100%',
    padding: '5px 0',
    bottom: '0px'
}

export default {
    header,
    tideHeader,
    backArrow,
    layout,
    content,
    footer
}

