const header = {
    margin: 0,
    padding: '0 10px',
    backgroundColor: '#AD9979',
    position: 'fixed',
    zIndex: 500,
    width: '100%',
    color: '#fff',
    fontSize: '14pt',
    textAlign: 'center',
    boxShadow: '0px 0px 3px -1px gray'
}

const tideHeader = {
    ...header,
    height: '40px',
    fontSize: '11pt',
    lineHeight: '40px',
    boxShadow: 'none'
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
    zIndex: 500,
    padding: '5px 0',
    bottom: '0px',
    boxShadow: '0px 0px 3px -1px gray'
}

export default {
    header,
    tideHeader,
    backArrow,
    layout,
    content,
    footer
}

