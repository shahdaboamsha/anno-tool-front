import { useMemo, useState, useEffect } from 'react';
import { createTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useNavigate, useLocation } from 'react-router-dom';
import AnnotationForm from '../../components/AnnotationForm';
import Loader from '../../components/Loader';

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

function useDemoRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        const fullPath = `/user/my${path.startsWith('/') ? path : `/${path}`}`;
        navigate(fullPath);
      }
    };
  }, [location, navigate]);
}

export default function Dashboard(props) {

  const navigate = useNavigate()

  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = () => {
      return localStorage.getItem('ACCESS_TOKEN') != null
    }
    !isLoggedIn() ? navigate('/signin') : setPageLoading(false)
  }, [])
  const { window } = props

  const router = useDemoRouter()

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <>
      {pageLoading ? <Loader />
        :
        <AppProvider
          branding={
            {
              logo: <img src='src\assets\icons\humanoid.png' />
            }
          }
          navigation={
            [
              {
                kind: 'header',
                title: 'Main items',
              },
              {
                segment: 'newtask',
                title: 'New Task',
                icon: <AddIcon />,
              },
              {
                segment: 'overview',
                title: 'Overview',
                icon: <DashboardIcon />,
              },
              {
                segment: 'orders',
                title: 'Orders',
                icon: <ShoppingCartIcon />,
              },
              {
                kind: 'divider',
              },
              {
                kind: 'header',
                title: 'Analytics',
              },
              {
                segment: 'reports',
                title: 'Reports',
                icon: <BarChartIcon />,
                children: [
                  {
                    segment: 'sales',
                    title: 'Sales',
                    icon: <DescriptionIcon />,
                  },
                  {
                    segment: 'traffic',
                    title: 'Traffic',
                    icon: <DescriptionIcon />,
                  },
                ],
              },
              {
                segment: 'integrations',
                title: 'Integrations',
                icon: <LayersIcon />,
              },
              {
                segment: 'uploads',
                title: 'Uploads'
              }
            ]
          }
          router={router}
          theme={demoTheme}
          window={demoWindow}
        >
          <DashboardLayout>
            <PageContainer>
              {router.pathname === '/user/my/overview' && <h1>Overview</h1>}
              {router.pathname === '/user/my/newtask' && <AnnotationForm />}
            </PageContainer>
          </DashboardLayout>
        </AppProvider>}
    </>
  )
}
