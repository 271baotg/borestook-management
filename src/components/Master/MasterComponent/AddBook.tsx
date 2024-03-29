import React from "react";
import { DialogHTMLAttributes, useEffect, useState } from "react";
import { Console, error } from "console";
import BookModel from "../../../models/BookModel";
import { title } from "process";
import { AxiosInstance } from "axios";


interface componentProps {
    axios: AxiosInstance;
    category: Category[];
}
export const AddBook: React.FC<componentProps> = (props) =>{
    const [book, setBook] = useState<{
        title: string;
        author: string;
        description: string;
        available: number;
        categoryList: { id: number; categoryName: string; }[]; // Assuming id is of type 'number' (long)
        img: string;
        price: number;
    }>({
        title: '',
        author: '',
        description: '',
        available: 1,
        categoryList: [],
        img: '',
        price: 0
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };


    useEffect(()=>{
        console.log("Book state: " + JSON.stringify(book));
    },[book])
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.options)
            .filter((option: HTMLOptionElement) => option.selected)
            .map((option: HTMLOptionElement) => ({
                id: parseInt(option.value), // Parse the value to ensure it's a number
                categoryName: option.label,
            })) as { id: number; categoryName: string; }[];
    
        // Tạo một mảng mới chứa các category đã chọn
        const updatedCategoryList = selectedOptions.map((selectedCategory) => ({
            id: selectedCategory.id,
            categoryName: selectedCategory.categoryName,
        }));
    
        // Cập nhật mảng categoryList với danh sách mới
        setBook((prevBook) => ({
            ...prevBook,
            categoryList: updatedCategoryList,
        }));
    };

    const handleInput = (event: any) => {
        setBook({...book, [event.target.name]: event.target.value})

    }

    async function base64ConversionForImages(e: any) {
        if (e.target && e.target.files && e.target.file[0]) {
            getBase64(e.target.file[0]);
        }
    }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            handleInput({
                target: {
                    name: 'img',
                    value: reader.result,
                },
            });
        };        
        reader.onerror = function (error){
            console.log("Error", error);
        }
    }

    //Create a new book
    const submitBook = async () => {
        try {
          var formData = new FormData();
          formData.append("image", selectedFile!);
          formData.append(
            "bookData",
            new Blob([JSON.stringify(book)], { type: "application/json" })
          );
          console.log("Show Book: " + JSON.stringify(book))
          const response: BookModel = await props.axios({
            method: "post",
            data: formData,
            url: "http://localhost:8081/books/save",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          console.log("Save Book: " + JSON.stringify(response));
          setDisplaySuccess(true);
        } catch (error) {
          console.log(error);
          setDisplayWarning(true);
        }
      };

    return (
    <div className="container mt-5 mb-5">
        {displaySuccess && 
            <div className="alert alert-success" role="alert">
                Book added successfully
            </div>
        }
        {displayWarning &&
            <div className="alert alert-danger" role="alert">
                All fields must be filled out
            </div>
        }
        <div className="card">
            <div className="card-header" style={{backgroundColor: '#00BFFF', color: 'white'}}>
                <h3>Add a new book</h3>
            </div>
            <div className="card-body">
                <form>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" name="title" required onChange={handleInput} />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Author</label>
                            <input type="text" className="form-control" name="author" required onChange={handleInput}/>
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Category</label>
                            <select multiple className="form-control" name="categoryList" onChange={handleCategoryChange}>
                                {props.category.map((cat, index) => (
                                    <option key={index} value={cat.id}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Avalable</label>
                            <input type="number" className="form-control" min={1} defaultValue={1} name="available" required onChange={handleInput}/>
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Price($)</label>
                            <input type="number" className="form-control" min={0} defaultValue={0} name="price" required onChange={handleInput}/>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" cols={50} rows={5} name="description" required onChange={handleInput}></textarea>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <input type="file" onChange={e => handleFileChange(e)}/>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button type="button" style={{backgroundColor: 'var(--blue-color)'}} className="btn btn-primary mt-3" onClick={submitBook}>
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
}

