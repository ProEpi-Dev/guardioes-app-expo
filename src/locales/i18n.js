import pt from './pt'

const translate = (key) => {
    const keys = key.split('.')
    let value = pt
    
    for (const k of keys) {
        value = value[k]
    }
    
    return value || key
}

export default translate
