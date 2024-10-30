import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { toast } from '@/components/ui/use-toast';
import LightningFS from '@isomorphic-git/lightning-fs';

const fs = new LightningFS('fs');

interface GitConfig {
  repo: string;
  branch: string;
  token: string;
  author: {
    name: string;
    email: string;
  };
}

class GitSync {
  private config: GitConfig | null = null;
  private isInitialized = false;

  async initialize(config: GitConfig) {
    if (!config.repo || !config.token) {
      throw new Error('Repository URL and token are required');
    }

    this.config = config;
    
    try {
      await git.init({ fs, dir: '/' });
      await git.addRemote({
        fs,
        dir: '/',
        remote: 'origin',
        url: config.repo
      });
      
      this.isInitialized = true;
      localStorage.setItem('git_config', JSON.stringify({
        repo: config.repo,
        branch: config.branch,
        author: config.author
      }));
    } catch (error) {
      console.error('Git initialization failed:', error);
      throw new Error('Failed to initialize Git repository');
    }
  }

  async syncChanges(fileName: string, content: string, message: string) {
    if (!this.config || !this.isInitialized) {
      console.warn('Git sync not initialized, skipping sync');
      return;
    }

    try {
      await fs.promises.writeFile(`/${fileName}`, content);
      await git.add({ fs, dir: '/', filepath: fileName });
      
      await git.commit({
        fs,
        dir: '/',
        message,
        author: {
          name: this.config.author.name,
          email: this.config.author.email
        }
      });

      await git.push({
        fs,
        http,
        dir: '/',
        remote: 'origin',
        ref: this.config.branch,
        onAuth: () => ({ username: this.config.token })
      });

      toast({
        title: "Success",
        description: "Changes synchronized with Git repository",
      });
    } catch (error) {
      console.error('Git sync failed:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync changes with Git repository",
        variant: "destructive"
      });
      throw error;
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      config: this.config ? {
        repo: this.config.repo,
        branch: this.config.branch,
        author: this.config.author
      } : null
    };
  }
}

export const gitSync = new GitSync();