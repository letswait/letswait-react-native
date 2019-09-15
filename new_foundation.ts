const colors = {
  coralPink: 'rgba(183,108,165,1)',
  coralBlue: 'rgba(19,124,164,1)',
  cosmos: 'rgba(33,33,33,1)',
  shadow: 'rgba(0,0,0,0.25)',
  white: 'rgba(255,255,255,1)',
  cloud: 'rgba(255,255,255,0.5)',
  seafoam: 'rgba(107,200,204,1)',
  capri: 'rgba(87,166,171,1)',
  turmeric: 'rgba(253,206,9,1)',
  mustard: 'rgba(191,155,0,1)',
  duckbill: 'rgba(235,124,48,1)',
  lavender: 'rgba(113,80,145,1)',
  stone: 'rgba(89,90,91,1)',
  facebookBlue: 'rgba(59,89,152,1)',
  transparentWhite: 'rgba(255, 255, 255, 0)',
}

const type = {
  title1: {
    fontSize: 36,
    lineHeight: 34,
    fontWeight: '800' as '800',
    color: colors.white,
  },
  title2: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800' as '800',
    color: colors.white,
  },
  large: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '400' as '400',
    color: colors.cosmos,
  },
  input: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '400' as '400',
    color: colors.white,
  },
  regular: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '400' as '400',
    color: colors.white,
  },
  small: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '400' as '400',
    color: colors.white,
  },
  micro: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '600' as '600',
    color: colors.shadow,
  },
}

export { colors, type }
