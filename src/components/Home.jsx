import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CardActionArea } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTheme } from '@mui/material/styles';

const HomePage = () => {
  const theme = useTheme();
  const primaryColor = "#000000"; // Asignamos negro como color primario

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const cardsData = [
    {
      id: 1,
      title: 'Certificados de Ahorro Energético (CAE)',
      description: 'CÁLCULO DEL AHORRO DE ENERGÍA mediante fichas de medidas estandarizadas.',
      image: '/img/cae.png',
      group: 'CAEs',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
    {
      id: 2,
      title: 'EFICIENCIA ENERGETICA',
      description: 'Descripción de la card 2',
      image: '/img/eie010.png',
      group: 'EFICIENCIA_ENERGETICA',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
    {
      id: 3,
      title: 'INSTALACIÓN ELÉCTRICA.',
      description: 'Baja Tensión',
      image: '/img/btx040.png',
      group: 'INSTALACIONES_ELÉCTRICAS_BT',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
    {
      id: 4,
      title: 'Card 4',
      description: 'Descripción de la card 4',
      image: '/img/eie010.png',
      group: 'CAEs',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
    {
      id: 5,
      title: 'Autoconsumo',
      description: 'Descripción de la card 3',
      image: '/img/eie010.png',
      group: 'Autoconsumo',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
    {
      id: 6,
      title: 'Card 4',
      description: 'Descripción de la card 4',
      image: '/img/eie010.png',
      group: 'CAEs',
      sector: '',
      searchtext: '',
      link: "/Docs",
    },
  ];

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    sessionStorage.setItem('selectedGroup', selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    sessionStorage.setItem('selectedSector', selectedSector);
  }, [selectedSector]);

  useEffect(() => {
    sessionStorage.setItem('searchText', searchText);
  }, [searchText]);

  const handleButtonClick = (group, sector, searchtext, link) => {
    setSelectedGroup(group);
    setSelectedSector(sector);
    setSearchText(searchtext);
    window.location.href = link;
  };

  return (
    <div>
      <Container sx={{ py: 4 }}></Container>

      <Slider {...carouselSettings}>
        {cardsData.map((card) => (
          <div key={card.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '400px',
                border: '1px solid',
                borderColor: primaryColor, // Se usa la variable en lugar de theme.palette.primary.main
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: '20px 40px',
                  height: '100%',
                  background: `linear-gradient(to right, ${primaryColor}, transparent)`, // Se usa primaryColor
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleButtonClick(card.group, card.sector, card.searchtext, card.link)}
                >
                  Ver más
                </Button>
              </div>

              <div
                style={{
                  flex: 1,
                  height: '100%',
                  minWidth: '50%',
                  minHeight: '100%',
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>


      <Container sx={{ py: 4 }}>
      
      {/* <Typography variant="h3" align="center" gutterBottom>
          DOCUMENTOS TÉCNICOS{' '}
          <Typography component="span" variant="inherit" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
            A MEDIDA
          </Typography>.
        </Typography>
       */}



        <Typography variant="h3" align="center" gutterBottom>
        Bienvenido a DocTec.blog
        </Typography>

        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
        Aqui tengo mis plantillas de documentos técnicos  
        <Typography component="span" variant="inherit" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>{' '}
            PERSONALIZABLES
          </Typography>{' '} 
          en linea . 
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
        Si te dedicas a la ingeniería, la energía solar o la eficiencia energética, puede que encuentres algo útil por aquí.
        </Typography>

      </Container>



      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {cardsData.map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  position: 'relative',
                  height: '100%',
                  border: '1px solid',
                  borderColor: primaryColor, // Se usa la variable en lugar de theme.palette.primary.main
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea sx={{ height: '100%' }} onClick={() => handleButtonClick(card.group, card.sector, card.searchtext, card.link)}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={card.image}
                    alt={card.title}
                    sx={{ width: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(to top, ${primaryColor}, transparent 60%)`, // Se usa primaryColor
                    }}
                  />

                  <CardContent
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      left: 15,
                      right: 15,
                      textAlign: 'left',
                      color: 'white',
                      padding: '10px 0',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {card.description}
                    </Typography>
                    <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {card.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
