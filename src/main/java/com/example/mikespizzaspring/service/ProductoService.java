package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.CategoriaProducto;
import com.example.mikespizzaspring.model.Producto;
import com.example.mikespizzaspring.model.ProductoPrecio;
import com.example.mikespizzaspring.model.TamanoPizza;
import com.example.mikespizzaspring.repository.CategoriaProductoRepository;
import com.example.mikespizzaspring.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaProductoRepository categoriaProductoRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    public void delete(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto crearProductoConPrecios(Long categoriaId,
                                            String nombre,
                                            String descripcion,
                                            BigDecimal precioPersonal,
                                            BigDecimal precioMediano,
                                            BigDecimal precioFamiliar,
                                            Integer stock,
                                            MultipartFile imagen) throws IOException {
        if (stock == null || stock <= 0) {
            throw new IllegalArgumentException("El stock debe ser mayor a cero");
        }
        if (precioPersonal == null || precioPersonal.compareTo(BigDecimal.ZERO) <= 0
                || precioMediano == null || precioMediano.compareTo(BigDecimal.ZERO) <= 0
                || precioFamiliar == null || precioFamiliar.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Los precios deben ser mayores a cero");
        }
        if (imagen == null || imagen.isEmpty()) {
            throw new IllegalArgumentException("La imagen es obligatoria");
        }

        CategoriaProducto categoria = categoriaProductoRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));

        Producto producto = new Producto();
        producto.setCategoriaProducto(categoria);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precioPersonal);
        producto.setStock(stock);
        producto.setActivo(true);
        producto.setImagenUrl(cloudinaryService.subirImagen(imagen));

        producto.addPrecio(crearPrecio(producto, TamanoPizza.PERSONAL, precioPersonal));
        producto.addPrecio(crearPrecio(producto, TamanoPizza.MEDIANO, precioMediano));
        producto.addPrecio(crearPrecio(producto, TamanoPizza.FAMILIAR, precioFamiliar));

        return productoRepository.save(producto);
    }

    public Producto crearProductoSimple(Long categoriaId,
                                        String nombre,
                                        String descripcion,
                                        BigDecimal precio,
                                        Integer stock,
                                        MultipartFile imagen) throws IOException {
        if (stock == null || stock <= 0) {
            throw new IllegalArgumentException("El stock debe ser mayor a cero");
        }
        if (precio == null || precio.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        if (imagen == null || imagen.isEmpty()) {
            throw new IllegalArgumentException("La imagen es obligatoria");
        }

        CategoriaProducto categoria = categoriaProductoRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));

        Producto producto = new Producto();
        producto.setCategoriaProducto(categoria);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setActivo(true);
        producto.setImagenUrl(cloudinaryService.subirImagen(imagen));

        // Un solo precio con tamaño UNICO
        producto.addPrecio(crearPrecio(producto, TamanoPizza.UNICO, precio));

        return productoRepository.save(producto);
    }


    private ProductoPrecio crearPrecio(Producto producto, TamanoPizza tamano, BigDecimal precio) {
        ProductoPrecio productoPrecio = new ProductoPrecio();
        productoPrecio.setProducto(producto);
        productoPrecio.setTamano(tamano);
        productoPrecio.setPrecio(precio);
        return productoPrecio;
    }
}
