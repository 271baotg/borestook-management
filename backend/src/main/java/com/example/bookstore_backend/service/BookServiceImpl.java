package com.example.bookstore_backend.service;


import com.example.bookstore_backend.dto.BookDTO;
import com.example.bookstore_backend.mapper.BookDTOMapper;
import com.example.bookstore_backend.model.Book;
import com.example.bookstore_backend.model.Category;
import com.example.bookstore_backend.model.Price;
import com.example.bookstore_backend.repository.BookRepository;
import com.example.bookstore_backend.repository.PriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Date;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService{
    private final Logger logger = LoggerFactory.getLogger(BookServiceImpl.class);

    private final PriceRepository priceRepository;
    private final BookRepository bookRepository;
    private BookDTOMapper bookDTOMapper;

    private final CloudinaryService cloudinaryService;
    public BookServiceImpl(PriceRepository priceRepository, BookRepository bookRepository, BookDTOMapper bookDTOMapper, CloudinaryService cloudinaryService) {
        this.priceRepository = priceRepository;
        this.bookRepository = bookRepository;
        this.bookDTOMapper = bookDTOMapper;
        this.cloudinaryService = cloudinaryService;
    }


    @Override
    public List<BookDTO> findAll() {
        return bookRepository
                .findAll()
                .stream()
                .map(bookDTOMapper)
                .peek(bookDTO -> {
                        Price latestPrice = priceRepository.findLatestPriceByDate(bookDTO.getId(), Date.from(Instant.now()));
                        bookDTO.setPrice(latestPrice.getPrice());
                    }
                )
                .collect(Collectors.toList());
    }

    @Override
    public Book create(BookDTO bookDTO, MultipartFile image) {
        String username = null;
        try {
            // Retrieve the username of the currently authenticated user
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }

            Book book = bookDTOMapper.mapToBook(bookDTO);
            Book savedBook = bookRepository.save(book);
            String img = (String) cloudinaryService.upload(image).get("url");
            savedBook.setImg(img);
            Price price = new Price(savedBook.getId(), bookDTO.getPrice());
            priceRepository.save(price);

            logger.info("User {} created a book with ID {}", username, savedBook.getId());
            return savedBook;
        } catch (Exception e) {
            logger.error("Failed to create book by user {}: {}", username, e.getMessage(), e);
            throw e; // Optionally rethrow the exception or handle it as needed
        }
    }

    @Override
    public Book update(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book update(BookDTO bookDTO) {
        Book book = bookDTOMapper.mapToBook(bookDTO);
        return bookRepository.save(book);
    }

    @Override
    public void deleteById(Long id) {
         bookRepository.deleteById(id);

    }

    @Override
    public List<BookDTO> findBookByCategory(Category category) {
        
        return null;
    }

    @Override
    public List<BookDTO> findByQuery(String query) {
        return bookRepository.findBookByTitle(query)
                .stream()
                .map(bookDTOMapper)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Book> findById(long id) {

            if(bookRepository.findById(id).isPresent())
                return Optional.of(bookRepository.findById(id).get());
            else return Optional.empty();
    }

    public Optional<BookDTO> Get(Long id){
        Optional<Book> bookOptional = bookRepository.findById(id);

        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            BookDTO bookDTO = bookDTOMapper.apply(book);
            return Optional.of(bookDTO);
        } else {
            return Optional.empty();
        }
    }

}
