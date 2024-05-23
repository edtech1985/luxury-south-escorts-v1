import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Slide,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Stack,
  InputLabel,
  FormControl,
  Fab,
  Tooltip,
  Chip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import modelsData from "../../db/models-details.json";
import ImageBox from "../../components/ImageBox";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Model } from "../../types";
import {
  BustTooltip,
  UnverifiedTooltip,
  VerifiedTooltip,
} from "../../components/Tooltips";
import { NewReleases, Verified } from "@mui/icons-material";
import Loading from "../../components/Loading";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Filters {
  modelType:
    | "loiras"
    | "morenas"
    | "ruivas"
    | "orientais"
    | "negras"
    | "mulatas"
    | "duplas"
    | "indiferente"
    | "";
  showFace: "sim" | "não" | "indiferente";
  alturaMin?: string;
  alturaMax?: string;
}

interface State extends SnackbarOrigin {
  open: boolean;
}

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

const MenuItemStyles = {
  bgcolor: "black",
  color: "gold",
};

// === === === BEGIN SCROLL TO TOP === === === //
function ScrollTop(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ zIndex: 9999 }}>
        {children}
      </Box>
    </Fade>
  );
}
// === === === END SCROLL TO TOP === === === //

export default function Models() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [snackbarStates, setSnackbarStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    modelType: "indiferente",
    showFace: "indiferente",
  });
  const [loading, setLoading] = useState(true); // Novo estado de carregamento

  const handleMouseEnter = (model: Model) => {
    setSelectedModel(model);
  };

  const handleMouseLeave = () => {
    setSelectedModel(null);
  };

  // === === === BEGIN SNACKBAR === === === //
  const [state] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;

  const handleSnackbar = (modelId: number) => {
    setSnackbarStates((prevState) => ({
      ...prevState,
      [modelId]: true,
    }));
  };

  const handleClose = (modelId: number) => {
    setSnackbarStates((prevState) => ({
      ...prevState,
      [modelId]: false,
    }));
  };
  // === === === END SNACKBAR === === === //

  // === === === BEGIN FAVORITES === === === //
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    // Simula o carregamento por 2 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFavoriteToggle = (modelId: number) => {
    let updatedFavorites: number[] = [];
    if (favorites.includes(modelId)) {
      updatedFavorites = favorites.filter((id) => id !== modelId);
    } else {
      updatedFavorites = [...favorites, modelId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  // === === === END FAVORITES === === === //

  // === === === BEGIN FILTERING === === === //
  const handleFilterChange = (value: string, filterName: keyof Filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handlemodelTypeChange = (
    e: SelectChangeEvent<
      | "loiras"
      | "morenas"
      | "ruivas"
      | "orientais"
      | "negras"
      | "mulatas"
      | "duplas"
      | "indiferente"
    >
  ) => {
    handleFilterChange(e.target.value, "modelType");
  };

  const handleshowFaceChange = (
    e: SelectChangeEvent<"sim" | "não" | "indiferente">
  ) => {
    handleFilterChange(e.target.value, "showFace");
  };

  const filteredModels = modelsData.filter((model) => {
    if (
      filters.modelType !== "indiferente" &&
      model.modelType !== filters.modelType
    ) {
      return false;
    }
    if (
      filters.showFace !== "indiferente" &&
      model.showFace !== filters.showFace
    ) {
      return false;
    }
    return true;
  });
  // === === === END FILTERING === === === //

  return (
    <Box textAlign="center">
      {loading && <Loading />}
      <div id="back-to-top-anchor" />
      <Box mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nossas Modelos
        </Typography>
        <Typography variant="body1" paragraph>
          Nossos terapeutas e massagistas são dedicados exclusivamente a
          proporcionar o máximo de prazer e relaxamento ao público masculino.
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center">
          <IconButton
            onClick={() => setFilterOpen(!filterOpen)}
            color="primary"
          >
            <TuneIcon />
            <Typography variant="body1" component="span" ml={1}>
              Filtros
            </Typography>
          </IconButton>
        </Stack>
      </Box>
      {filterOpen && (
        <Stack direction="row" justifyContent="center" mb={2}>
          <Box
            width={400}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FormControl fullWidth>
              <InputLabel id="modelType">Tipo de Modelo</InputLabel>
              <Select
                value={filters.modelType}
                onChange={handlemodelTypeChange}
                variant="standard"
                color="primary"
                id="modelType"
                label="Tipo de Modelo"
                labelId="modelType"
                sx={{
                  mx: 1,
                  bgcolor: "primary.light",
                }}
              >
                <MenuItem
                  value="Selecione o Tipo de Modelo"
                  sx={{ MenuItemStyles }}
                  disabled
                >
                  Selecione o Tipo de Modelo
                </MenuItem>
                <MenuItem value="indiferente" sx={{ MenuItemStyles }}>
                  Indiferente
                </MenuItem>
                <MenuItem value="loiras" sx={{ MenuItemStyles }}>
                  Loiras
                </MenuItem>
                <MenuItem value="morenas" sx={{ MenuItemStyles }}>
                  Morenas
                </MenuItem>
                <MenuItem value="ruivas" sx={{ MenuItemStyles }}>
                  Ruivas
                </MenuItem>
                <MenuItem value="orientais" sx={{ MenuItemStyles }}>
                  Orientais
                </MenuItem>
                <MenuItem value="negras" sx={{ MenuItemStyles }}>
                  Negras
                </MenuItem>
                <MenuItem value="mulatas" sx={{ MenuItemStyles }}>
                  Mulatas
                </MenuItem>
                <MenuItem value="duplas" sx={{ MenuItemStyles }}>
                  Duplas
                </MenuItem>
              </Select>
            </FormControl>

            <Box
              width={400}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FormControl fullWidth>
                <InputLabel id="showFace">Mostra o rosto</InputLabel>
                <Select
                  value={filters.showFace || "Mostra o rosto"}
                  onChange={handleshowFaceChange}
                  variant="standard"
                  color="primary"
                  id="showFace"
                  label="Mostra o rosto"
                  labelId="showFace"
                  sx={{ mx: 1, bgcolor: "primary.light" }}
                >
                  <MenuItem
                    value="Mostar o rosto"
                    sx={{ MenuItemStyles }}
                  ></MenuItem>
                  <MenuItem value="indiferente" sx={{ MenuItemStyles }}>
                    Indiferente
                  </MenuItem>
                  <MenuItem value="sim" sx={{ MenuItemStyles }}>
                    Mostra o rosto
                  </MenuItem>
                  <MenuItem value="nao" sx={{ MenuItemStyles }}>
                    Não mostra o rosto
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Stack>
      )}
      <Grid container justifyContent="center" spacing={1}>
        {filteredModels.map((model) => (
          <Grid item key={model.id} xs={12} sm={6} md={4} zIndex={999}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
              onMouseEnter={() => handleMouseEnter(model as Model)}
              onMouseLeave={handleMouseLeave}
              zIndex={999}
            >
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackbarStates[model.id] || false}
                autoHideDuration={2000}
                onClose={() => handleClose(model.id)}
                message={
                  favorites.includes(model.id)
                    ? "Modelo adicionado aos favoritos"
                    : "Modelo removido dos favoritos"
                }
                key={vertical + horizontal}
                sx={{ zIndex: 9999, mt: 5 }}
              />

              <ImageBox
                src={model.profilePicture}
                id={model.id}
                alt={model.name}
                modelAvatar={model.avatar}
                onFavoriteToggle={() => handleFavoriteToggle(model.id)}
                handleSnackbar={() => handleSnackbar(model.id)} // Passa o model.id como argumento
              />
              {selectedModel === model && (
                <Slide
                  direction="up"
                  in={true}
                  mountOnEnter
                  unmountOnExit
                  timeout={1000}
                >
                  <Paper
                    sx={{
                      position: "absolute",
                      zIndex: 999,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      bgcolor: "rgba(0, 0, 0, 0.97)",
                      color: "primary.light",
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {model.name}
                    </Typography>
                    <Grid id="model-details" container spacing={0} zIndex={999}>
                      <Grid item xs={4}>
                        <Box id="model-details-1">
                          <Typography variant="body2" gutterBottom>
                            Idade: {model.modelDetails.age}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Altura: {model.modelDetails.height}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Peso: {model.modelDetails.weight}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box id="model-details-2">
                          <Typography variant="body2" gutterBottom>
                            Olhos: {model.modelDetails.eyeColor}
                          </Typography>
                          <BustTooltip
                            title={
                              "Tipo de busto: " + model.modelDetails.bustType
                            }
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 700 }}
                            placement="top"
                            arrow
                          >
                            <Typography variant="body2" gutterBottom>
                              Busto: {model.modelDetails.bust}
                            </Typography>
                          </BustTooltip>
                          <Typography variant="body2" gutterBottom>
                            Cintura: {model.modelDetails.waist}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box id="model-details-3">
                          <Typography variant="body2" gutterBottom>
                            Quadril: {model.modelDetails.hips}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Pés: {model.modelDetails.feet}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} pt={2}>
                        <Box
                          id="model-location"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          textAlign="center"
                        >
                          <LocationOnIcon />
                          {model.hasLocation ? (
                            <Typography>
                              {model.localInfo.neighborhood}
                            </Typography>
                          ) : (
                            <Typography>Sem local</Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Avatar
                      alt={model.name}
                      src={model.avatar}
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        width: 40,
                        height: 40,
                        zIndex: 900,
                      }}
                    />{" "}
                    <Fab
                      size="small"
                      sx={{
                        bgcolor: "transparent",
                        position: "absolute",
                        zIndex: 600,
                        top: 5,
                        right: 40,
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      {model.hasVideoVerification === true ? (
                        <Box
                          sx={{
                            width: "fit-content",
                            borderRadius: "16px",
                          }}
                        >
                          <VerifiedTooltip
                            title="Esta modelo enviou o vídeo de verificação a menos de 6 meses."
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 700 }}
                            placement="top"
                            arrow
                          >
                            <Chip
                              label="Verified"
                              size="small"
                              icon={<Verified />}
                              color="success"
                              sx={{
                                "&:hover": {
                                  bgcolor: "green",
                                },
                              }}
                            />
                          </VerifiedTooltip>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: "fit-content",
                            borderRadius: "16px",
                          }}
                        >
                          <UnverifiedTooltip
                            title="Esta modelo ainda não enviou o vídeo de verificação."
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 700 }}
                            placement="top"
                            arrow
                          >
                            <Chip
                              label="Unverified"
                              size="small"
                              icon={<NewReleases />}
                              color="error"
                              sx={{
                                "&:hover": {
                                  bgcolor: "red",
                                },
                              }}
                            />
                          </UnverifiedTooltip>
                        </Box>
                      )}
                    </Fab>
                    <Fab
                      size="small"
                      sx={{
                        color: "white",
                        bgcolor: "green",
                        border: "solid 2px green",
                        "&:hover": {
                          color: "#8D7B26",
                          bgcolor: "black",
                          borderColor: "#8D7B26",
                          borderWidth: 2,
                        },
                        position: "absolute",
                        zIndex: 600,
                        bottom: 15,
                        right: 15,
                      }}
                      onClick={() => {
                        if (selectedModel) {
                          const whatsappNumber =
                            selectedModel.socialMedia.whatsapp;
                          const url = `https://wa.me/${whatsappNumber}`;
                          window.open(url, "_blank");
                        }
                      }}
                    >
                      <WhatsAppIcon />
                    </Fab>
                  </Paper>
                </Slide>
              )}

              <Typography
                variant="subtitle2"
                component="p"
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  fontWeight: "bold",
                  textShadow: "-3px 5px 3px black",
                  zIndex: 650,
                }}
              >
                {model.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <ScrollTop>
        <Tooltip title="Voltar ao topo" arrow>
          <Fab
            size="small"
            aria-label="scroll back to top"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 9999,
              opacity: 0.4,
              transition: "opacity 0.5s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
      </ScrollTop>
    </Box>
  );
}
