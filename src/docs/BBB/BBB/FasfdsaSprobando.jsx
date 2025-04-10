import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Fade, 
  Zoom, 
  Slide, 
  Grow,
  useScrollTrigger,
  Container,
  Divider,
  styled
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { Palette, ArrowForward } from '@mui/icons-material';

// Animación personalizada
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// Componente estilizado
const FashionCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
  animation: `${floatAnimation} 6s ease-in-out infinite`,
}));

const AnimatedTypography = styled(Typography)({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '0%',
    height: 3,
    backgroundColor: 'currentColor',
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  },
});

const FashionComponent = () => {
  const [checked, setChecked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  useEffect(() => {
    setChecked(true);
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fashionItems = [
    {
      title: 'Diseño Innovador',
      description: 'Soluciones creativas que destacan tu marca',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
    },
    {
      title: 'Experiencia Digital',
      description: 'Interfaces intuitivas y atractivas para tus clientes',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    },
    {
      title: 'Tecnología Avanzada',
      description: 'Implementamos las últimas tendencias en desarrollo web',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    },
  ];

  return (
    <Box sx={{ 
      bgcolor: 'background.paper',
      py: 10,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg">
        {/* Sección principal con efecto de aparición */}
        <Fade in={checked} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
            <Typography 
              variant="overline" 
              color="primary" 
              sx={{ 
                letterSpacing: 3,
                display: 'block',
                mb: 2,
              }}
            >
              TENDENCIAS DIGITALES
            </Typography>
            <AnimatedTypography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Transformamos tu visión en realidad
            </AnimatedTypography>
            <Divider sx={{ 
              width: 100, 
              height: 4, 
              bgcolor: 'primary.main', 
              mx: 'auto', 
              my: 4,
              borderRadius: 2,
            }} />
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Creamos experiencias digitales únicas que conectan con tu audiencia y reflejan la esencia de tu marca.
            </Typography>
          </Box>
        </Fade>

        {/* Tarjetas con efectos */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {fashionItems.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow 
                in={checked} 
                timeout={1000 + index * 300}
                style={{ transitionDelay: checked ? `${index * 300}ms` : '0ms' }}
              >
                <FashionCard sx={{ animationDelay: `${index * 1}s` }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                    sx={{ 
                      objectFit: 'cover',
                      filter: activeIndex === index ? 'none' : 'grayscale(20%)',
                      transition: 'filter 0.5s ease',
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </FashionCard>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Sección con efecto de scroll */}
        <Slide direction="up" in={trigger} mountOnEnter unmountOnExit>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText', 
            p: 4, 
            borderRadius: 2,
            textAlign: 'center',
            mb: 8,
          }}>
            <Typography variant="h4" gutterBottom>
              ¿Listo para llevar tu presencia digital al siguiente nivel?
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              endIcon={<ArrowForward />}
              sx={{ 
                mt: 3,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contáctanos
            </Button>
          </Box>
        </Slide>

        {/* Elemento decorativo */}
        <Zoom in={checked} style={{ transitionDelay: checked ? '500ms' : '0ms' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mt: 6,
          }}>
            <Palette sx={{ 
              fontSize: 80, 
              color: 'primary.main',
              opacity: 0.2,
              transform: 'rotate(15deg)',
            }} />
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default FashionComponent;