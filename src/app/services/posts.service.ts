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
  private postsUpdated = new Subject<{ post: Post[], postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {
    if (!environment.production) {
      this.LOCAL_URL = 'http://localhost:3000';
    }
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ posts: any, maxPosts: number }>(this.LOCAL_URL + '/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          post: postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.post;
        this.postsUpdated.next(
          {
            post: [...this.posts],
            postCount: transformedPosts.maxPosts
          });
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
        this.router.navigate(['/']);
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
        this.router.navigate(['/']);
      });
  }

  deletePosts(postId: string) {
    return this.http.delete(this.LOCAL_URL + '/api/posts/' + postId);
  }
}
