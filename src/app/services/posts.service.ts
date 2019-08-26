import { Injectable } from '@angular/core';
import { Post } from '../posts/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  LOCAL_URL = '';
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) {
    if (!environment.production) {
      this.LOCAL_URL = 'http://localhost:3000';
    }
  }

  getPosts() {
    this.http.get<{ posts: any }>(this.LOCAL_URL + '/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image, title);

    this.http.post<{ post: Post }>(this.LOCAL_URL + '/api/posts', formData)
      .subscribe((responseData: any) => {
        const post: Post = {
          id: responseData.post._id,
          title,
          content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
        console.log(responseData);
      });
  }

  getPost(id: string) {
    return this.http
      .get<{ _id: string, title: string, content: string, imagePath: string }>(this.LOCAL_URL + '/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }
    this.http.put(this.LOCAL_URL + '/api/posts/' + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePosts(postId: string) {
    this.http.delete(this.LOCAL_URL + '/api/posts/' + postId)
      .subscribe(() => {
        const postsFiltered = this.posts.filter((post) => post.id !== postId);
        this.posts = postsFiltered;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
