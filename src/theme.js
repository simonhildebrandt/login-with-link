import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
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
        color: "teal.500"
      }
    }
  },
  components: {
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
      width: ["100%", null, "48%", null, "24%"],
      mb: 4
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
