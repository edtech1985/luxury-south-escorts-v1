import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import modelsData from "../models-details.json";
import BackButton from "../../../components/buttons/backButton";
import ImageBox from "../../../components/ImageBox";

interface ModelDetailsProps {
  name: string;
}

const ModelDetails: React.FC<ModelDetailsProps> = () => {
  const { name: massagistName } = useParams<{ name: string }>();

  const massagist = modelsData.find(
    (model: { name: string }) => model.name.toLowerCase() === massagistName
  );

  if (!massagist) {
    return (
      <Typography>Detalhes sobre o massagista não encontrados.</Typography>
    );
  }

  const { name, description, photo1, photo2, photo3, photo4, photo5, photo6 } =
    massagist;

  return (
    <Box textAlign="center">
      <Grid
        container
        justifyContent="center"
        spacing={1}
        p={{ base: 2, md: 3 }}
      >
        <Grid item xs={12}>
          <Box textAlign="left">
            <BackButton />
          </Box>
        </Grid>
        <Grid item xs={12} mx={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            {name}
          </Typography>
          <Typography variant="body1" paragraph>
            {description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {[photo1, photo2, photo3, photo4, photo5, photo6].map(
              (photo, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Box
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ImageBox
                      src={photo}
                      alt={`Massagista ${name}`}
                      aria-label={`Massagista ${name}`}
                      modelAvatar={massagist.avatar}
                    />
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModelDetails;
