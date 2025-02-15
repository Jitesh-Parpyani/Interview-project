import {
  Container,
  Group,
  Image,
  Menu,
  UnstyledButton,
  Center,
  rem,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Example links array with optional sub-links
const links = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/profile",
    label: "Profile",
    links: [{ link: "/logout", label: "Logout" }],
  },
];

const useStyles = createStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
  },

  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  hiddenOnSmall: {
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.black,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

export default function HeaderMenu() {
  const { classes } = useStyles();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const renderMenuItems = () => {
    return links.map((link) => {
      if (link.links?.length) {
        return (
          <Menu
            key={link.label}
            trigger="hover"
            openDelay={100}
            closeDelay={100}
          >
            <Menu.Target>
              <UnstyledButton className={classes.link}>
                <Center inline>
                  <span className={classes.linkLabel}>{link.label}</span>
                </Center>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {link.links.map((sub) =>
                sub.link === "/logout" ? (
                  <Menu.Item
                    key={sub.link}
                    className={classes.link}
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    {sub.label}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={sub.link}
                    className={classes.link}
                    component={Link}
                    to={sub.link}
                  >
                    {sub.label}
                  </Menu.Item>
                )
              )}
            </Menu.Dropdown>
          </Menu>
        );
      }
      return (
        <Link key={link.label} to={link.link} className={classes.link}>
          {link.label}
        </Link>
      );
    });
  };

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.container}>
        {/* Logo */}
        <Image
          src="https://pipedream.com/s.v0/app_mE7hlb/logo/orig"
          alt="Logo"
          mr="xl"
          w="50px"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {/* Horizontal menu group */}
        <Group grow className={classes.hiddenOnSmall} align="center" ml="auto">
          {renderMenuItems()}
        </Group>
      </Container>
    </header>
  );
}
