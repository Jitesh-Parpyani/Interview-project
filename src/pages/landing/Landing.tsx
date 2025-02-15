import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Text,
  LoadingOverlay,
  Pagination,
  Card,
  Title,
  TextInput,
  ScrollArea,
  rem,
  Flex,
  Divider,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import useFetch from "../../hooks/useFetch"; //  Import useFetch
import { createStyles } from "@mantine/emotion";

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  climate: string;
  terrain: string;
  url: string;
}

export default function Landing() {
  const navigate = useNavigate();

  const useStyles = createStyles((theme) => ({
    mainContainer: { position: "relative", padding: rem(16) },
    searchBar: { minWidth: rem(250) },
    dataRow: { cursor: "pointer" },
  }));
  const { classes } = useStyles();
  // State Management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500); //  Debouncing for 500 miliseconds
  const [isSearching, setIsSearching] = useState(false); //  Track search mode

  // API Calls using useFetch
  const {
    data: paginatedData,
    loading: loadingPaginated,
    error: errorPaginated,
  } = useFetch(`/planets/?page=${page}`);

  const {
    data: searchData,
    loading: loadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
  } = useFetch(
    debouncedSearch.length > 0 ? `/planets/?search=${debouncedSearch}` : ""
  );

  // Determine data source: API Search or Paginated
  const loading = isSearching ? loadingSearch : loadingPaginated;
  const error = isSearching ? errorSearch : errorPaginated;
  const planets = isSearching
    ? searchData?.results || []
    : paginatedData?.results || [];
  const totalPages = isSearching
    ? 1
    : Math.ceil((paginatedData?.count || 0) / 10);

  // Handle search state
  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setIsSearching(true);
      refetchSearch(); //  Fetch search results
    } else {
      setIsSearching(false);
      setPage(1); // Reset pagination
    }
  }, [debouncedSearch]);

  // Extract Planet ID
  function extractPlanetId(url: string) {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }

  // Table Headers
  function renderHeader(label: string) {
    return <Table.Th>{label}</Table.Th>;
  }

  return (
    <Box className={classes.mainContainer}>
      <LoadingOverlay visible={loading} />

      {error && <Text mb="md">Error loading planets. {error}</Text>}

      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="md">
          Star Wars Planets
        </Title>

        {/*  Search Input with Debouncing */}
        <Flex
          align="center"
          justify="space-between"
          mb="md"
          wrap="wrap"
          gap="md"
        >
          <TextInput
            placeholder="Search for a planet..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className={classes.searchBar}
          />
          <Text size="sm" color="dimmed">
            Showing {planets.length} planets
          </Text>
        </Flex>

        <Divider mb="md" />

        {/*  Table */}
        <ScrollArea>
          <Table highlightOnHover striped verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                {renderHeader("Name")}
                {renderHeader("Rotation")}
                {renderHeader("Orbital")}
                {renderHeader("Climate")}
                {renderHeader("Terrain")}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {planets.length === 0 && !loading ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text>No planets found.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                planets.map((p: Planet) => {
                  const pid = extractPlanetId(p.url);
                  return (
                    <Table.Tr
                      key={p.name}
                      onClick={() => navigate(`/products/${pid}`)}
                      className={classes.dataRow}
                    >
                      <Table.Td>{p.name}</Table.Td>
                      <Table.Td>{p.rotation_period}</Table.Td>
                      <Table.Td>{p.orbital_period}</Table.Td>
                      <Table.Td>{p.climate}</Table.Td>
                      <Table.Td>{p.terrain}</Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/*  Pagination (only if not searching) */}
        {!isSearching && totalPages > 1 && (
          <Flex justify="center" mt="md">
            <Pagination total={totalPages} value={page} onChange={setPage} />
          </Flex>
        )}
      </Card>
    </Box>
  );
}
