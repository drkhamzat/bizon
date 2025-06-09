import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';

import ProductCard from '../components/products/ProductCard';
import { fetchProducts } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { categorySlug } = useParams();

  // Состояние фильтров
  const [filters, setFilters] = useState({
    category: categorySlug || '',
    minPrice: '',
    maxPrice: '',
    material: '',
    inStock: false,
    search: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
  });

  // Состояние для мобильного отображения фильтров
  const [showFilters, setShowFilters] = useState(false);

  // Получение данных из Redux
  const { products, loading, totalPages, currentPage } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);

  // Получение параметров запроса из URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const updatedFilters = { ...filters };

    // Обновление фильтров из URL параметров
    if (searchParams.has('category')) {
      updatedFilters.category = searchParams.get('category');
    }
    if (searchParams.has('search')) {
      updatedFilters.search = searchParams.get('search');
    }
    if (searchParams.has('minPrice')) {
      updatedFilters.minPrice = searchParams.get('minPrice');
    }
    if (searchParams.has('maxPrice')) {
      updatedFilters.maxPrice = searchParams.get('maxPrice');
    }
    if (searchParams.has('material')) {
      updatedFilters.material = searchParams.get('material');
    }
    if (searchParams.has('inStock')) {
      updatedFilters.inStock = searchParams.get('inStock') === 'true';
    }
    if (searchParams.has('sort')) {
      updatedFilters.sort = searchParams.get('sort');
    }
    if (searchParams.has('order')) {
      updatedFilters.order = searchParams.get('order');
    }
    if (searchParams.has('page')) {
      updatedFilters.page = parseInt(searchParams.get('page'), 10);
    }

    // Если есть параметр categorySlug из URL, используем его
    if (categorySlug) {
      updatedFilters.category = categorySlug;
    }

    setFilters(updatedFilters);
  }, [location.search, categorySlug]);

  // Загрузка товаров и категорий
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Обработчики изменения фильтров
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1, // Сброс страницы при изменении других фильтров
    }));
  };

  // Обработчик поиска
  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', e.target.search.value);
  };

  // Обработчик изменения страницы
  const handlePageChange = (event, value) => {
    handleFilterChange('page', value);
  };

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      material: '',
      inStock: false,
      search: '',
      sort: 'createdAt',
      order: 'desc',
      page: 1,
    });
  };

  // Список материалов (в реальном проекте можно получить из API)
  const materials = ['ЛДСП', 'Дерево', 'Экокожа', 'Металл', 'Стекло', 'Текстиль'];

  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Каталог мебели
      </Typography>

      {/* Мобильная кнопка фильтров */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          fullWidth
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Фильтры */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: { xs: showFilters ? 'block' : 'none', md: 'block' },
          }}
        >
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Фильтры
            </Typography>

            {/* Поиск */}
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
              <TextField
                name="search"
                label="Поиск"
                variant="outlined"
                fullWidth
                size="small"
                defaultValue={filters.search}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Категории */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Категория</InputLabel>
              <Select
                value={filters.category}
                label="Категория"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Все категории</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            {/* Цена */}
            <Typography variant="subtitle2" gutterBottom>
              Цена, ₽
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="От"
                type="number"
                size="small"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="До"
                type="number"
                size="small"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Материал */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Материал</InputLabel>
              <Select
                value={filters.material}
                label="Материал"
                onChange={(e) => handleFilterChange('material', e.target.value)}
              >
                <MenuItem value="">Все материалы</MenuItem>
                {materials.map((material) => (
                  <MenuItem key={material} value={material}>
                    {material}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            {/* Наличие */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange('inStock', e.target.checked)
                    }
                  />
                }
                label="В наличии"
              />
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Сортировка */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={`${filters.sort}-${filters.order}`}
                label="Сортировка"
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleFilterChange('sort', sort);
                  handleFilterChange('order', order);
                }}
              >
                <MenuItem value="createdAt-desc">Сначала новые</MenuItem>
                <MenuItem value="createdAt-asc">Сначала старые</MenuItem>
                <MenuItem value="price-asc">Сначала дешевые</MenuItem>
                <MenuItem value="price-desc">Сначала дорогие</MenuItem>
                <MenuItem value="name-asc">По названию (А-Я)</MenuItem>
                <MenuItem value="name-desc">По названию (Я-А)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </Paper>
        </Grid>

        {/* Список товаров */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Typography>Загрузка...</Typography>
          ) : products.length === 0 ? (
            <Typography>Товары не найдены</Typography>
          ) : (
            <>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Пагинация */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CatalogPage;