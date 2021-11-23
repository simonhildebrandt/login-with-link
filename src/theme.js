import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    body: "Inter"
  },
  colors: {
    brand: {
      100: '#D6E6FF',
      300: '#4D94FF',
      600: "#3182CE"
    },
    red: {
      600: "#E53E3E"
    },
    blue: {
      500: "#1b73f8"
    }
  },
  styles: {
    global: {
      h2: {
        fontSize: ["20px", "24px"],
        fontWeight: "semibold",
        lineHeight: "110%",
        letterSpacing: "-1%",
        margin: "24px 0 16px 0",
      },
      h3: {
        fontSize: ["18px", "20px"],
        fontWeight: "semibold",
        lineHeight: "110%",
        letterSpacing: "-1%",
        margin: "24px 0 16px 0",
      },
      p: {
        margin: "8px 0",
      },
      a: {
        color: "blue.500",
        fontWeight: "700"
      }
    }
  },
  components: {
    Tag: {
      baseStyle: {
        fontSize: "14px",
      }
    },
    FormLabel: {
      baseStyle: {
        fontSize: "12px"
      }
    },
    ClientMenuItem: {
      baseStyle: {
        fontWeight: 700,
        p: '8px',
        pl: '12px',
        borderRadius: '5px'
      },
      variants: {
        selected: {
          bg: 'brand.100',
          color: 'brand.300',
          my: '5px'
        }
      }
    },
    Button: {
      sizes: {
        md: {
          px: "30px",
        }
      },
      variants: {
        outline: {
          borderWidth: "2px",
        }
      }
    },
    Editable: {
      sizes: {
        xl: {
          input: {
            fontSize: "2xl"
          },
          preview: {
            fontSize: "2xl"
          }
        }
      }
    }
  },
  layerStyles: {
    doubled: {
      mb: 4,
      flexGrow: 1,
    }
  },
  textStyles: {
    h1: {
      fontSize: ["24px", "28px"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
      margin: "8px 0",
    },
    h2: {
      fontSize: ["24px", "28px"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    h3: {
      fontSize: ["20px", "24px"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    p: {
      margin: "8px 0",
    },
    link: {
      color: "teal.500"
    },
    muted: {
      color: "gray.100"
    }
  },
});

export default theme;
