import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Image,
  Title,
  Text,
  LoadingOverlay,
  Group,
  Badge,
  Grid,
  Progress,
  Paper,
  rem,
  Divider,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const useStyles = createStyles((theme) => ({
  heroSection: {
    position: "relative",
    height: rem(250),
    overflow: "hidden",
    marginBottom: rem(40),
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
  },

  heroImage: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    display: "block",
  },

  contentContainer: {
    maxWidth: "90%",
    margin: "0 auto",
    padding: `${rem(10)} ${rem(8)}`,
  },

  filmCard: {
    padding: rem(20),
    backgroundColor: theme.colors.gray[0],
  },

  sectionTitle: {
    marginBottom: rem(12),
  },
}));

export default function PlanetDetails() {
  const { productId } = useParams();
  const { classes } = useStyles();

  //  Main fetch for the single planet
  const {
    data: planet,
    loading: planetLoading,
    error: planetError,
  } = useFetch<any>(productId ? `/planets/${productId}` : "");

  //  Additional state for “films” (data enrichment)
  const [films, setFilms] = useState<any[]>([]);
  const [filmsLoading, setFilmsLoading] = useState<boolean>(false);
  const [filmsError, setFilmsError] = useState<string>("");

  // Utility: turn "climate" or "terrain" strings into array of items
  const splitByComma = (value?: string) =>
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const climates = splitByComma(planet?.climate);
  const terrains = splitByComma(planet?.terrain);

  // Attempt to parse surface water
  let surfaceWaterValue: number | null = null;
  if (planet?.surface_water && planet.surface_water !== "unknown") {
    const num = Number(planet.surface_water);
    if (!isNaN(num)) {
      surfaceWaterValue = num;
    }
  }

  // Fetch film data after planet loads
  useEffect(() => {
    if (!planet || !planet.films) return;
    setFilms([]);
    setFilmsLoading(true);
    setFilmsError("");

    Promise.all(
      planet.films.map((filmUrl: string) =>
        fetch(filmUrl).then((res) => {
          if (!res.ok) {
            throw new Error(`Film fetch failed: ${res.status}`);
          }
          return res.json();
        })
      )
    )
      .then((results) => setFilms(results))
      .catch((err) => setFilmsError(err.message))
      .finally(() => setFilmsLoading(false));
  }, [planet]);

  const isLoadingAny = planetLoading || filmsLoading;

  return (
    <>
      {/* Hero Section */}
      <Box className={classes.heroSection}>
        <Image
          src="https://images.unsplash.com/photo-1608178398319-48f814d0750c?q=80&w=2406&auto=format&fit=crop"
          alt="Space background"
          className={classes.heroImage}
        />
      </Box>

      {/* Main Content Container */}
      <Container className={classes.contentContainer}>
        <LoadingOverlay visible={isLoadingAny} />

        {/* Errors */}
        {planetError && (
          <Text color="red" mb="sm">
            Error loading planet: {planetError}
          </Text>
        )}
        {filmsError && (
          <Text color="red" mb="sm">
            Error loading films: {filmsError}
          </Text>
        )}
        <Group grow align="flex-start">
          {/* Planet Card */}
          {planet && (
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Title order={2} mb="sm" variant="gradient">
                {planet.name}
              </Title>

              {/* Climate & Terrain Badges */}
              {climates && climates.length > 0 && (
                <Group mb="xs">
                  <Text size="sm" color="dimmed">
                    Climate:
                  </Text>
                  {climates.map((climate) => (
                    <Badge key={climate} color="grape" variant="filled">
                      {climate}
                    </Badge>
                  ))}
                </Group>
              )}

              {terrains && terrains.length > 0 && (
                <Group mb="lg">
                  <Text size="sm" color="dimmed">
                    Terrain:
                  </Text>
                  {terrains.map((terrain) => (
                    <Badge key={terrain} color="lime" variant="filled">
                      {terrain}
                    </Badge>
                  ))}
                </Group>
              )}

              {/* Planet stats in a 2-column Grid */}
              <Grid gutter="md">
                <Grid.Col>
                  <Text size="sm">Rotation Period</Text>
                  <Text size="md">{planet.rotation_period}</Text>
                </Grid.Col>
                <Grid.Col>
                  <Text size="sm">Orbital Period</Text>
                  <Text size="md">{planet.orbital_period}</Text>
                </Grid.Col>
                <Grid.Col>
                  <Text size="sm">Diameter</Text>
                  <Text size="md">{planet.diameter}</Text>
                </Grid.Col>
                <Grid.Col>
                  <Text size="sm">Gravity</Text>
                  <Text size="md">{planet.gravity}</Text>
                </Grid.Col>
                <Grid.Col>
                  <Text size="sm">Population</Text>
                  <Text size="md">{planet.population}</Text>
                </Grid.Col>
              </Grid>

              <Divider my="lg" />

              {/* Surface Water */}
              <Text size="sm" mb="xs">
                Surface Water
              </Text>
              {surfaceWaterValue !== null ? (
                <Progress
                  value={surfaceWaterValue}
                  size="xl"
                  radius="xl"
                  color="blue"
                  striped
                />
              ) : (
                <Text size="sm" color="dimmed">
                  Unknown
                </Text>
              )}
            </Card>
          )}

          {/* Film Card (data enrichment) */}
          {films.length > 0 && (
            <Paper radius="md" className={classes.filmCard}>
              <Title order={4} className={classes.sectionTitle}>
                Featured in {films.length} film(s):
              </Title>
              {films.map((film) => (
                <Group key={film.title} mb="sm">
                  <Badge color="grape" size="lg" variant="filled">
                    {film.title}
                  </Badge>
                  <Text c="dimmed" size="sm">
                    Release date: {film.release_date}
                  </Text>
                </Group>
              ))}
            </Paper>
          )}
        </Group>
      </Container>
    </>
  );
}
