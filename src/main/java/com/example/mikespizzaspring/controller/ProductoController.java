package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Producto;
import com.example.mikespizzaspring.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> create(@RequestParam("categoriaId") Long categoriaId,
                                           @RequestParam("nombre") String nombre,
                                           @RequestParam(value = "descripcion", required = false) String descripcion,
                                           @RequestParam("precioPersonal") BigDecimal precioPersonal,
                                           @RequestParam("precioMediano") BigDecimal precioMediano,
                                           @RequestParam("precioFamiliar") BigDecimal precioFamiliar,
                                           @RequestParam("stock") Integer stock,
                                           @RequestParam("imagen") MultipartFile imagen) throws IOException {
        try {
            Producto created = productoService.crearProductoConPrecios(
                    categoriaId,
                    nombre,
                    descripcion,
                    precioPersonal,
                    precioMediano,
                    precioFamiliar,
                    stock,
                    imagen
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping(value = "/simple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> createSimple(@RequestParam("categoriaId") Long categoriaId,
                                                 @RequestParam("nombre") String nombre,
                                                 @RequestParam(value = "descripcion", required = false) String descripcion,
                                                 @RequestParam("precio") BigDecimal precio,
                                                 @RequestParam("stock") Integer stock,
                                                 @RequestParam("imagen") MultipartFile imagen) throws IOException {
        try {
            Producto created = productoService.crearProductoSimple(
                    categoriaId, nombre, descripcion, precio, stock, imagen);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Producto>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        Optional<Producto> producto = productoService.findById(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
